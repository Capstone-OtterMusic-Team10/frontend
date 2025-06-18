import { useParams } from "react-router"

const MusicSubChat = () =>{

    let {chatId} = useParams()
    console.log(chatId)
    return (
        <>
        {/* <div id='subchat'>
            {
            
            chat&& chat.map((message, id)=>(
                < div className="chatMessages" key={id}>
                    <p className="chat-user">{message.user}</p>
                    <p className="chat-bot">{message.bot}</p>
                </div >
            ))
            }
        </div> */}
        </>
    )
}

export default MusicSubChat