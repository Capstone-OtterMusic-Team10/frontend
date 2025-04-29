import MusicChatSideBar from "../components/MusicChatSideBar"
import otter from '../assets/logo.png'
const MusicChat = () =>{
    return (
        <>
            <div className="musicChatComponents">
                <MusicChatSideBar/>
                <div id="myChat">
                    <div id="chatBox">
                    <textarea className="customInput" placeholder="Type your message..."></textarea> 
                    <button id="otterButton"><img id="otterForButton" src={otter}></img></button>    
                    </div>    
                </div>
            </div>
        </>
    )
}

export default MusicChat