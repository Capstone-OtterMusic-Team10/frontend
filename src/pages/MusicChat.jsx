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
    const [key, setKey] = useState("0")
    const navigate = useNavigate()
    const {chatId} = useParams()

    const handleKey = (e) =>{
        if (e.key == "Enter"){
            sendMessage()
        }
    }
    const sendMessage = async()=>{
        if (chatId){
            const _ = await api.post("talk", {
                prompt: prompt,
                chat: chatId,
                bpm: BPM,
                key: 0
                })
        }else{
            const response = await api.post("talk", {
                prompt: prompt,
                chat: chatId,
                bpm: BPM,
                key: 0
                })
            setNewConvo(response.data.new_chat)
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
                        <label htmlFor="bpm">BPM</label>
                        <input id="bpm" type="range" min="40" max="240" value={BPM} onChange={e=>setBPM(e.target.value)}></input>{BPM} BPM
                    </div>
                    <div>
                            <select id="music-key" name="musicKey" value={key} onChange={e=>{
                                setKey(e.target.value)

                                }}>
                                <option value="0">Default / The model decides</option>
                                <option value="1">C major / A minor</option>
                                <option value="2">D♭ major / B♭ minor</option>
                                <option value="3">D major / B minor</option>
                                <option value="4">E♭ major / C minor</option>
                                <option value="5">E major / C♯/D♭ minor</option>
                                <option value="6">F major / D minor</option>
                                <option value="7">G♭ major / E♭ minor</option>
                                <option value="8">G major / E minor</option>
                                <option value="9">A♭ major / F minor</option>
                                <option value="10">A major / F♯/G♭ minor</option>
                                <option value="11">B♭ major / G minor</option>
                                <option value="12">B major / G♯/A♭ minor</option>
                            </select>
                    </div>
                     <div>
                        <label htmlFor="bpm">Weight</label>
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