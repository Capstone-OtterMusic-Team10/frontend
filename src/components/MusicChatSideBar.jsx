import Accordion from 'react-bootstrap/Accordion';
import { Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
const MusicChatSideBar = () =>{
    const [chats, setChats] = useState([])

    useEffect(()=>{
        setChats([{name:"ACDC-ish", id:123}, {name: "Metallica-ish", id: 124}, {name: "Japanese Lofi", id: 125}, {name: "Coding Lofi", id: 126}, {name: "Dark Academia music", id: 127}, {name: "Light Academia Music", id: 128}])
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
                            <Link key={idx} to={`${chat.id}`}>{chat.name}</Link>
                        )
                        }
                    </div>
            </div>
        </>
    )
}


export default MusicChatSideBar