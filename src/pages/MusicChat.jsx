import MusicChatSideBar from "../components/MusicChatSideBar"
import { Outlet, useParams } from "react-router"
import otter from '../assets/logo.png'
import { useState, useEffect } from "react"
import { api } from "../utils"


const MusicChat = () =>{
    const [prompt, setPrompt] = useState("")
    const [chat, setChat] = useState([])

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
            const _ = await api.post("talk", {content: prompt})
        }
        setPrompt("")
    }
    const getChat = async() =>{
        const response = await api.get("chat")
        setChat(response.data.conversation)
        console.log(response)
    }
    useEffect(()=>{
        getChat()
    }, [prompt])
    return (
        <>
            <div className="musicChatComponents">
                <MusicChatSideBar/>
                
                {!chatId?
                    (
                        <div id="myChat">
                            <div id='subchat'>
                                {
                                
                                chat&& chat.map((message, id)=>(
                                    < div className="chatMessages" key={id}>
                                        <p className="chat-user">{message.user}</p>
                                        <p className="chat-bot">{message.bot}</p>
                                    </div >
                                ))
                                }
                            </div>
                            <div id="chatBox">
                                <textarea value={prompt} onKeyDown = {e=>handleKey(e)} onChange={e=>setPrompt(e.target.value)} className="customInput" placeholder="Type your message..."></textarea> 
                                <button id="otterButton" onClick={sendMessage}><img id="otterForButton" src={otter}></img></button>    
                            </div>  
                        </div>
                    )
                
                :
                    <Outlet/>
                }
                    
                
            </div>
        </>
    )
}

export default MusicChat