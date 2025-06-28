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
    const [BPM, setBPM] = useState(120)
    const [weight, setWeight] = useState(1)
    const [key, setKey] = useState()
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
    // Add BPM (slider), Key (dropdown), Weight (slider), volume, 
    return (
        <>
            <div className="musicChatComponents">
                <MusicChatSideBar chats={chat} setChat={setChat} />
                <div id="myChat">
                {chatId&&
                            <Outlet context={introduceNew}/>
                }
                <div id="chatBox">
                    <div id="musicSpecOPtions">
                    <div>
                        <label for="bpm">BPM</label>
                        <input id="bpm" type="range" min="40" max="240" value={BPM} onChange={e=>setBPM(e.target.value)}></input>{BPM} BPM
                    </div>
                    <div>
                            <select id="music-key" name="musicKey" value={key} onChange={e=>setKey(e.target.value)}>
                            <option selected="selected" value="C">Select a key</option>
                            <optgroup label="Major Keys">
                                <option value="C">C Major</option>
                                <option value="C#">C# Major</option>
                                <option value="D">D Major</option>
                                <option value="D#">D# Major</option>
                                <option value="E">E Major</option>
                                <option value="F">F Major</option>
                                <option value="F#">F# Major</option>
                                <option value="G">G Major</option>
                                <option value="G#">G# Major</option>
                                <option value="A">A Major</option>
                                <option value="A#">A# Major</option>
                                <option value="B">B Major</option>
                            </optgroup>
                            <optgroup label="Minor Keys">
                                <option value="Cm">C Minor</option>
                                <option value="C#m">C# Minor</option>
                                <option value="Dm">D Minor</option>
                                <option value="D#m">D# Minor</option>
                                <option value="Em">E Minor</option>
                                <option value="Fm">F Minor</option>
                                <option value="F#m">F# Minor</option>
                                <option value="Gm">G Minor</option>
                                <option value="G#m">G# Minor</option>
                                <option value="Am">A Minor</option>
                                <option value="A#m">A# Minor</option>
                                <option value="Bm">B Minor</option>
                            </optgroup>
                            </select>
                    </div>
                     <div>
                        <label for="bpm">Weight</label>
                        <input id="bpm" min="0" max="2" step="0.1" value={weight} type="range" onChange={e=>setWeight(e.target.value)}></input> {weight}
                    </div>
                    </div>
                    <textarea value={prompt} onKeyDown = {e=>handleKey(e)} onChange={e=>setPrompt(e.target.value)} className="customInput" placeholder="Type your message..."></textarea> 
                    <button id="otterButton" onClick={sendMessage}><img id="otterForButton" src={otter}></img></button>          
                </div>
                </div>    
                
            </div>
        </>
    )
}

export default MusicChat