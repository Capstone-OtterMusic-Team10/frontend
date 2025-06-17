import { Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { api } from '../utils';
import { FolderPen, Trash } from 'lucide-react';

const MusicChatSideBar = () =>{
    const [chats, setChats] = useState([])
    const getChat = async() =>{
        const response = await api.get("chat")
        setChats(response.data)
        console.log(response)
    }
    const editChatName = async() =>{

    }
    const deleteChat = async(id) =>{
        try{
            const _ = await api.delete(`chat/${id}`)
            getChat()
        }catch (error){
            console.error("An error occurred:", error.message);
        }
        
    }
    useEffect(()=>{
        getChat()
    }, [])

    return (
        <>
            <div className="sideBar">
                <Link to="/"><ArrowLeft/></Link>
                    <div className="inLineDiv">
                        <p className="Subheading">Add a folder</p>
                        <button className="plusButton"><Plus/></button>
                    </div>
                    <div id="subchat">
                        {chats && chats.map((chat, idx)=>
                            <Link className="chatLinks" key={idx} to={`${chat.id}`}>{chat.title} <span><button onClick={editChatName}><FolderPen/></button> <button onClick={e=>deleteChat(chat.id)}><Trash/></button></span></Link>
                        )
                        }
                    </div>
            </div>
        </>
    )
}


export default MusicChatSideBar