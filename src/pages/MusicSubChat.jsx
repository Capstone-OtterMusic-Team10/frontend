import { useNavigate, useParams, useOutletContext } from "react-router"
import { api } from "../utils"
import { useEffect, useState } from "react"
import otter from '../assets/logo.png'



const MusicSubChat = () =>{
    const [messages, setMessages] = useState([])
    // const [audios, setAudios] = useState([])

    const [audioMap, setAudioMap] = useState({});

    const {introduceNew, loadingASong, setLoadingASong, newMessage} = useOutletContext();

    const navigate = useNavigate()

    let {chatId} = useParams()

    const getMessages = async()=>{
        let response = await api.get(`getmessages/${chatId}`)
        console.log(response.data)
        if (response.status == 200){
            setMessages(response.data)
        }else{
            console.error(response.data)
            navigate("/chat")
        }
    }
    useEffect(()=>{
        setTimeout(function(){
            getAudioForMessages()
            setLoadingASong(false)
        }, 40000)
    }, [newMessage])

    useEffect(()=>{
        getMessages()
    }, [chatId, introduceNew])

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
                console.error(err)
                newMap[message.id] = "nil";
            }
        }));
        console.log(newMap)
        setAudioMap(newMap);
    };

    useEffect(() => {
        getAudioForMessages();
        var objDiv = document.getElementById("subchat")
        objDiv.scrollTop = objDiv.scrollHeight;
    }, [messages]);

    return (
        <>
        <div id='subchat'>
            {
            messages && messages.map((message) => (
                <div className="chatMessages" key={message.id}>
                    <p className="chat-user">{message.content}</p>
                    <div className="chat-bot">
                      { audioMap[message.id] && audioMap[message.id] != "nil" ? (
                            <audio controls src={audioMap[message.id]} />
                        ) :  !loadingASong && audioMap[message.id] == "nil"?(
                            <p>No audio was generated, sorry!</p>
                        ): loadingASong?(
                                <div id="spinner"><img id="otterspinner" src={otter}></img></div>
                        ):
                        <p></p>
                        }
                        {
                            
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