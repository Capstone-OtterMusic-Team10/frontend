import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { api } from '../utils';
import { FolderPen, Trash, SquarePen } from 'lucide-react';

const MusicChatSideBar = ({ chats, setChat }) => {
    const [editing, setEditing] = useState(-1);
    const [newName, setNewName] = useState("");
    const { chatId } = useParams();
    const navigate = useNavigate();
    const jwtToken = localStorage.getItem("token");
    const isLoggedIn = !!jwtToken;
    // Hide sidebar if not logged in
    if (!isLoggedIn) {
        return null;
    }

    const getChat = async () => {
        if (!jwtToken) return;
        try {
            const response = await api.get("chat", {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                    "Content-Type": "application/json",
                },
            });
            if (!response.data.message) {
                setChat(response.data.sort((a, b) => b.id - a.id));
            }
        } catch (error) {
            console.error("Failed to fetch chats:", error.response ? error.response.data : error);
        }
    };

    const editChatName = async (event) => {
        if (event.key === "Enter") {
            let response = await api.put(`chat/${editing}`, { "title": newName });
            if (response.status === 200) {
                setEditing(-1);
                getChat();
            } else {
                console.error(response.status);
            }
            setNewName("");
        }
    };

    const deleteChat = async (id) => {
        try {
            const _ = await api.delete(`chat/${id}`);
            getChat();
            navigate("/chat");
        } catch (error) {
            console.error("An error occurred:", error.message);
        }
    };

    useEffect(() => {
        getChat();
    }, []);

    return (
        <>
            <div className="sideBar">
                <Link to="/"><ArrowLeft /></Link>
                <div className="inLineDiv">
                    <p className="Subheading">Start new chat</p>
                    <button onClick={() => {
                        navigate("/chat");
                    }}><SquarePen /></button>
                </div>
                <div id="chatLinks">
                    {Array.isArray(chats) && chats.map((chat, idx) => (
                        chat.id === editing ?
                            <input
                                type="text"
                                onKeyDown={e => editChatName(e)}
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder="Enter new chat name"
                                autoFocus
                                onBlur={() => setEditing(-1)}></input>
                            :
                            chat.id === chatId ?
                                <Link id="chatLinksPicked" key={chat.id} to={`${chat.id}`}><span className="chatTitle">{chat.title}</span> <span><button onClick={() => setEditing(chat.id)}><FolderPen /></button> <button onClick={() => deleteChat(chat.id)}><Trash /></button></span></Link>
                                :
                                <Link className="chatLinks" key={chat.id} to={`${chat.id}`}><span className="chatTitle">{chat.title}</span> <span><button onClick={() => setEditing(chat.id)}><FolderPen /></button> <button onClick={() => deleteChat(chat.id)}><Trash /></button></span></Link>
                    ))}
                </div>
            </div>
        </>
    );
};
export default MusicChatSideBar;