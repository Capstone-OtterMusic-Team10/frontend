import MusicChatSideBar from "../components/MusicChatSideBar";
import { Outlet, useParams, useNavigate, Link } from "react-router";
import otter from "../assets/logo.png";
import { useState, useEffect } from "react";
import { api } from "../utils";
import * as Tone from "tone";
import { ArrowLeft } from "lucide-react";
import MusicSubChat from "./MusicSubChat";

const MusicChat = () => {
    const [prompt, setPrompt] = useState("");
    const [newConvo, setNewConvo] = useState(null);
    const [introduceNew, setIntroduceNew] = useState(false);
    const [chat, setChat] = useState([]);
    const [BPM, setBPM] = useState(120);
    const [weight, setWeight] = useState(1);
    const [key, setKey] = useState("0");
    const [loadingASong, setLoadingASong] = useState({});
    const [newMessage, setNewMessage] = useState(null);
    const [localMessages, setLocalMessages] = useState([]);
    const navigate = useNavigate();
    const { chatId } = useParams();
    const jwtToken = localStorage.getItem("token");
    const isLoggedIn = !!jwtToken;

    const handleKey = (e) => {
        if (e.key === "Enter") {
            sendMessage();
            getChat();
        }
    };

    const sendMessage = async () => {
        const cleanedPrompt = prompt.trim();
        if (!cleanedPrompt) return; // Prevent empty prompt
        const payload = {
            prompt: cleanedPrompt,
            bpm: Number(BPM),
            key: Number(key),
        };
        if (isLoggedIn && chatId) payload.chat = chatId;
        try {
            // Ensure Tone.start() is called after user gesture (button click)
            await Tone.start();
            const headers = isLoggedIn
                ? {
                    Authorization: `Bearer ${jwtToken}`,
                    "Content-Type": "application/json",
                }
                : {
                    "Content-Type": "application/json",
                };
            const response = await api.post("talk", payload, { headers });
            const msgId = response.data.message;
            setNewMessage(msgId);
            setLoadingASong((prev) => ({ ...prev, [msgId]: true }));
            if (isLoggedIn) {
                if (response.data.new_chat) setNewConvo(response.data.new_chat);
            } else {
                // For non-logged-in users, store temporary message ID and prompt
                setLocalMessages((prev) => [
                    ...prev,
                    { id: msgId, content: cleanedPrompt, role: "user" },
                ]);
            }
            setIntroduceNew(!introduceNew);
            setPrompt("");
            if (isLoggedIn) getChat();
        } catch (err) {
            console.error("Error in sendMessage:", err.response ? err.response.data : err);
            alert("Failed to send message. Check the console for details.");
        }
    };

    const getChat = async () => {
        if (!isLoggedIn) {
            setChat([]); // Clear chats for non-logged-in users
            return;
        }
        try {
            const response = await api.get("chat", {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                    "Content-Type": "application/json",
                },
            });
            setChat(response.data);
        } catch (err) {
            console.error("Error fetching chats:", err.response ? err.response.data : err);
        }
    };

    useEffect(() => {
        if (isLoggedIn && newConvo) {
            navigate(`${newConvo}`);
        }
    }, [newConvo, isLoggedIn]);

    return (
        <>
            <div className="musicChatComponents">
                {isLoggedIn ? (
                    <MusicChatSideBar chats={chat} setChat={setChat} />
                ) : (
                    <Link
                        to="/"
                        style={{
                            position: "absolute",
                            top: "10px",
                            left: "10px",
                            zIndex: 10,
                        }}
                    >
                        <ArrowLeft />
                    </Link>
                )}
                <div id="myChat" style={isLoggedIn ? {} : { marginLeft: "0" }}>
                    <MusicSubChat
                        introduceNew={introduceNew}
                        loadingASong={loadingASong}
                        setLoadingASong={setLoadingASong}
                        newMessage={newMessage}
                        localMessages={localMessages}
                    />
                    <div id="chatBox">
                        <div id="musicSpecOPtions">
                            <div>
                                <label htmlFor="bpm">BPM </label>
                                <input
                                    id="bpm"
                                    type="range"
                                    min="40"
                                    max="240"
                                    value={BPM}
                                    onChange={(e) => setBPM(e.target.value)}
                                />
                                {BPM}
                            </div>
                            <div>
                                <select
                                    id="music-key"
                                    name="musicKey"
                                    value={key}
                                    onChange={(e) => setKey(e.target.value)}
                                >
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
                                <label htmlFor="weight">Weight </label>
                                <input
                                    id="weight"
                                    min="0"
                                    max="2"
                                    step="0.1"
                                    value={weight}
                                    type="range"
                                    onChange={(e) => setWeight(e.target.value)}
                                />
                                {weight}
                            </div>
                        </div>
                        <textarea
                            value={prompt}
                            onKeyDown={handleKey}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="customInput"
                            placeholder="Type your message..."
                        ></textarea>
                        <button id="otterButton" onClick={sendMessage}>
                            <img id="otterForButton" src={otter} alt="otter" />
                        </button>
                    </div>
                </div>
                <button
                    id="helpButton"
                    onClick={() =>
                        alert(
                            "BPM = Beats Per Minute, or the tempo of the song.\nWeight = How strongly your input affects the output."
                        )
                    }
                >
                    ?
                </button>
            </div>
        </>
    );
};
export default MusicChat;