import { Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { api } from '../utils';
import { FolderPen, Trash } from 'lucide-react';
import { Exception } from 'sass-embedded';

const MusicChatSideBar = () =>{
    const [chats, setChats] = useState([])
    const [editing, setEditing] = useState(-1)
    const [newName, setNewName] = useState("")
    const getChat = async() =>{
        const response = await api.get("chat")
        if (!response.data.message) {
            setChats(response.data)
            console.log(response.data)
        }
    }
    const editChatName = async(event) =>{
        if (event.key == "Enter"){
            let response = await api.put(`chat/${editing}`)
            if (response.status == 200){
                setEditing(-1)
                getChat()
            }else{
                console.error(response.status)
            }
        }

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
                        {chats && chats.map((chat, idx)=>(
                                chat.id == editing?
                                   <input type="text" 
                                   onKeyDown = {e=>editChatName(e)}
                                   value = {newName} 
                                   onChange={(e)=>setNewName(e.target.value)} 
                                   placeholder="Enter new chat name" 
                                   autoFocus 
                                   onBlur={()=>setEditing(-1)}>
                                    
                                   </input>
                                :
                                    <Link 
                                    className="chatLinks" 
                                    key={idx} to={`${chat.id}`}>
                                    <span className="chatTitle">{chat.title}</span>
                                    <span><button onClick={()=>setEditing(chat.id)}><FolderPen/></button> <button onClick={()=>deleteChat(chat.id)}><Trash/></button></span></Link>
                        )
                        )
                        }
                    </div>
            </div>
        </>
    )
}


export default MusicChatSideBar