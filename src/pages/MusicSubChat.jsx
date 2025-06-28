import { useNavigate, useParams, useOutletContext } from "react-router"
import { api } from "../utils"
import { useEffect, useState, useRef } from "react"
import MusicPlayer from '../components/musicEditor/MusicPlayer'




const MusicSubChat = () =>{
    const [messages, setMessages] = useState([])
    // const [audios, setAudios] = useState([])
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
            console.log(messages)
        }else{
            console.error(response.data)
            navigate("/chat")
        }
    }
    useEffect(()=>{
        getMessages()
    }, [chatId, flag])

    // const getAudios = async() =>{
    //     let response = await api.get(`get-audio`)
    //     console.log(response)
    // }
    useEffect(()=>{
        // getAudios() 
    }, [messages])
    return (
        <>
        <div id='subchat'>
            {
            
            messages&& messages.map((message, id)=>(
                < div className="chatMessages" key={id}>
                    <p className="chat-user">{message.content}</p>
                    <MusicPlayer audio={`http://127.0.0.1:5000/get_audio`} ref={audioRef}/>
                </div >
            ))
            }
        </div>
        </>
    )
}

export default MusicSubChat