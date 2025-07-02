import { useNavigate, useParams, useOutletContext } from "react-router"
import { api } from "../utils"
import { useEffect, useState, useRef } from "react"
import MusicPlayer from '../components/musicEditor/MusicPlayer'




const MusicSubChat = () =>{
    const [messages, setMessages] = useState([])
    // const [audios, setAudios] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [audioMap, setAudioMap] = useState({});

    const flag = useOutletContext();
    const navigate = useNavigate()
    const audioRef = useRef()
    let {chatId} = useParams()
    console.log(flag)
    const getMessages = async()=>{
        let response = await api.get(`getmessages/${chatId}`)
        console.log(response.data)
        if (response.status == 200){
            setMessages(response.data)
            // console.log(messages)
        }else{
            console.error(response.data)
            navigate("/chat")
        }
    }
    useEffect(()=>{
        getMessages()
    }, [chatId, flag])

    const getAudioForMessages = async () => {
        const newMap = {};
        await Promise.all(messages.map(async (message) => {
            try {
            const res = await api.get(
                `/get-audio/${chatId}/${message.id}`, // cache-buster
                { responseType: 'blob' }
            );
            
            if (res.data.size > 0) {
                const blob = new Blob([res.data], { type: 'audio/wav' });
                const url = URL.createObjectURL(blob);
                newMap[message.id] = url;
            } else {
                console.warn(`Audio ${message.id} was empty`);
            }
            } catch (err) {
            console.error(`Failed to fetch audio ${message.id}:`, err);
            newMap[message.id] = "nil";
            }
        }));
        console.log(newMap)
        setAudioMap(newMap);
        setIsLoading(false);
    };

    useEffect(() => {
        setIsLoading(true);
        getAudioForMessages();
    }, [messages]);


    return (
        <>
        <div className='subchat'>
            {
            
            messages && messages.map((message) => (
                <div className="chatMessages" key={message.id}>
                    <p className="chat-user">{message.content}</p>
                    <div className="chat-bot">
                      {audioMap[message.id] && audioMap[message.id] != "nil" ? (
                            <audio controls src={audioMap[message.id]} />
                        ) : audioMap[message.id] == "nil"?(
                            <p>No audio was generated, sorry!</p>
                        ):
                        <p>Loading audio...</p>
                        }
                    </div>
                </div>
            ))
            }
        </div>
        </>
    )
}

export default MusicSubChat