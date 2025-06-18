import { useParams } from "react-router"
import { api } from "../utils"
import { useEffect, useState } from "react"
import { useOutletContext } from "react-router"

const MusicSubChat = () =>{
    const [messages, setMessages] = useState([])
    const flag = useOutletContext();

    let {chatId} = useParams()
    console.log(flag)
    const getMessages = async()=>{
        let response = await api.get(`getmessages/${chatId}`)
        console.log(response.data)
        if (response.status == 200){
            setMessages(response.data)
        }else{
            console.error(response.data)
        }
    }
    useEffect(()=>{
        getMessages()
    }, [chatId, flag])
    return (
        <>
        <div id='subchat'>
            {
            
            messages&& messages.map((message, id)=>(
                < div className="chatMessages" key={id}>
                    <p className="chat-user">{message.content}</p>
                    <p className="chat-bot">ugh</p>
                </div >
            ))
            }
        </div>
        </>
    )
}

export default MusicSubChat