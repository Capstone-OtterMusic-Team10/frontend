import MusicChatSideBar from "../components/MusicChatSideBar"
import { Outlet, useParams, useNavigate } from "react-router"
import otter from '../assets/logo.png'
import { useState, useEffect } from "react"
import { api } from "../utils"


const MusicChat = () =>{
    const [prompt, setPrompt] = useState("")
    const [newConvo, setNewConvo] = useState(null)
    const [introduceNew, setIntroduceNew] = useState(false)
    const [chat, setChat] = useState([])
    const navigate = useNavigate()
    const {chatId} = useParams()

    const handleKey = (e) =>{
        if (e.key == "Enter"){
            sendMessage()
        }
    }
    const sendMessage = async()=>{
        if (chatId){
            const _ = await api.post("talk", {content: prompt, chat: chatId, })
        }else{
            const response = await api.post("talk", {content: prompt})
            setNewConvo(response.data.new_convo)
        }
        setIntroduceNew(!introduceNew)
        setPrompt("")
    }
    const getChat = async() =>{
        const response = await api.get("chat")
        setChat(response.data)
    }
    useEffect(()=>{
        getChat()
    }, [prompt])

    useEffect(()=>{
        if (newConvo) {
            navigate(`${newConvo}`);
        }
    }, [newConvo])
    return (
        <>
            <div className="musicChatComponents">
                <MusicChatSideBar chats={chat} setChat={setChat} />
                <div id="myChat">
                {chatId&&
                            <Outlet context={introduceNew}/>
                }
                <div id="chatBox">
                    <textarea value={prompt} onKeyDown = {e=>handleKey(e)} onChange={e=>setPrompt(e.target.value)} className="customInput" placeholder="Type your message..."></textarea> 
                    <button id="otterButton" onClick={sendMessage}><img id="otterForButton" src={otter}></img></button>          
                </div>
                </div>    
                
            </div>
        </>
    )
}

export default MusicChat