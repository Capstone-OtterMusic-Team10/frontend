import MusicChatSideBar from "../components/MusicChatSideBar"
import { Outlet } from "react-router"
import otter from '../assets/logo.png'

const MusicChat = () =>{
    const currentPathname = window.location.href;
    console.log(currentPathname)
    return (
        <>
            <div className="musicChatComponents">
                <MusicChatSideBar/>
                
                {currentPathname==="http://localhost:5173/chat"?
                    (
                        <div id="myChat">
                            <div id="chatBox">
                                <textarea className="customInput" placeholder="Type your message..."></textarea> 
                                <button id="otterButton"><img id="otterForButton" src={otter}></img></button>    
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