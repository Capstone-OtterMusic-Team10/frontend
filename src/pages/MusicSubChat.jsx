import { useParams } from "react-router"
import otter from '../assets/logo.png'

const MusicSubChat = () =>{

    let {chatId} = useParams()
    console.log(chatId)
    return (
        <>
        <div id="myChat">
            <h1>{chatId}</h1>
            <div id="chatBox">
                <textarea className="customInput" placeholder="Type your message..."></textarea> 
                <button id="otterButton"><img id="otterForButton" src={otter}></img></button>    
            </div>  
        </div>
        </>
    )
}

export default MusicSubChat