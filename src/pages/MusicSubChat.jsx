import { useNavigate, useParams } from "react-router";
import axios from "axios";
import { useEffect, useState } from "react";
import otter from "../assets/logo.png";

// Custom Axios instance for audio requests to suppress 404 console logs
const audioApi = axios.create({
    baseURL: "http://127.0.0.1:5000/",
    validateStatus: (status) => status === 200 || status === 404, // Treat 404 as valid
});

const MusicSubChat = ({
                          introduceNew,
                          loadingASong,
                          setLoadingASong,
                          newMessage,
                          localMessages,
                      }) => {
    const [messages, setMessages] = useState([]);
    const [audioMap, setAudioMap] = useState({});
    const navigate = useNavigate();
    const { chatId } = useParams();
    const jwtToken = localStorage.getItem("token");
    const isLoggedIn = !!jwtToken;

    const getMessages = async () => {
        if (isLoggedIn && !chatId) {
            setMessages([]);
            return;
        }
        if (!isLoggedIn) {
            setMessages(localMessages);
            return;
        }
        try {
            let response = await axios.get(`http://127.0.0.1:5000/getmessages/${chatId}`, {
                headers: isLoggedIn ? { Authorization: `Bearer ${jwtToken}` } : {},
            });
            console.log(response.data);
            if (response.status === 200) {
                setMessages(response.data);
            } else {
                console.error(response.data);
                navigate("/chat");
            }
        } catch (err) {
            console.error("Error fetching messages:", err.response ? err.response.data : err);
            navigate("/chat");
        }
    };

    useEffect(() => {
        if (!newMessage) return;
        const timeout = setTimeout(() => {
            getAudioForMessages();
            if (!audioMap[newMessage]) {
                setAudioMap((prev) => ({ ...prev, [newMessage]: "nil" }));
            }
            setLoadingASong((prev) => ({ ...prev, [newMessage]: false }));
        }, 60000);
        return () => clearTimeout(timeout);
    }, [newMessage, audioMap]);

    useEffect(() => {
        getMessages();
    }, [chatId, introduceNew, localMessages]);

    const getAudioForMessages = async () => {
        const headers = isLoggedIn ? { Authorization: `Bearer ${jwtToken}` } : {};
        const newMap = {};
        await Promise.all(
            messages.map(async (message) => {
                try {
                    const res = await audioApi.get(`/get-audio/${chatId || "temp"}/${message.id}`, {
                        responseType: "blob",
                        headers,
                    });
                    if (res.status === 200 && res.data.size > 0) {
                        const blob = new Blob([res.data], { type: "audio/wav" });
                        const url = URL.createObjectURL(blob);
                        newMap[message.id] = url;
                    }
                } catch (err) {
                    if (err.response && err.response.status !== 404) {
                        console.error(`Unexpected error fetching audio for ${message.id}:`, err);
                    }
                }
            })
        );
        console.log(newMap);
        setAudioMap((prev) => ({ ...prev, ...newMap }));
    };

    useEffect(() => {
        getAudioForMessages();
        const objDiv = document.getElementById("subchat");
        if (objDiv) objDiv.scrollTop = objDiv.scrollHeight;
    }, [messages]);

    useEffect(() => {
        const intervals = {};
        messages.forEach((message) => {
            const id = message.id;
            if (!audioMap[id] && loadingASong[id]) {
                intervals[id] = setInterval(() => getAudioForMessage(id), 3000);
            }
        });
        return () => {
            Object.values(intervals).forEach(clearInterval);
        };
    }, [messages, audioMap, loadingASong]);

    const getAudioForMessage = async (id) => {
        const headers = isLoggedIn ? { Authorization: `Bearer ${jwtToken}` } : {};
        try {
            const res = await audioApi.get(`/get-audio/${chatId || "temp"}/${id}`, {
                responseType: "blob",
                headers,
            });
            if (res.status === 200 && res.data.size > 0) {
                const blob = new Blob([res.data], { type: "audio/wav" });
                const url = URL.createObjectURL(blob);
                setAudioMap((prev) => ({ ...prev, [id]: url }));
            }
        } catch (err) {
            if (err.response && err.response.status !== 404) {
                console.error(`Unexpected error fetching audio for ${id}:`, err);
            }
        }
    };

    return (
        <>
            <div id="subchat">
                {messages &&
                    messages.map((message) => (
                        <div className="chatMessages" key={message.id}>
                            <p className="chat-user">{message.content}</p>
                            <div className="chat-bot">
                                {audioMap[message.id] && audioMap[message.id] !== "nil" ? (
                                    <audio controls src={audioMap[message.id]} />
                                ) : loadingASong[message.id] ? (
                                    <div id="spinner">
                                        <img id="otterspinner" src={otter} />
                                    </div>
                                ) : audioMap[message.id] === "nil" ? (
                                    <p>No audio was generated, sorry!</p>
                                ) : (
                                    <p></p>
                                )}
                            </div>
                        </div>
                    ))}
            </div>
        </>
    );
};

export default MusicSubChat;