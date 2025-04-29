import Accordion from 'react-bootstrap/Accordion';
import { Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
const MusicChatSideBar = () =>{
    const [folders, setFolders] = useState([
        {folder: "Rock", chats: [{name:"ACDC-ish", id:123}, {name: "Metallica-ish", id: 124}]}, 
        {folder: "LoFi", chats: [{name: "Japanese Lofi", id: 125}, {name: "Coding Lofi", id: 126}]}, 
        {folder: "Studying", chats: [{name: "Dark Academia music", id: 127}, {name: "Light Academia Music", id: 128}]}
    ])


    return (
        <>
            <div className="sideBar">
                <Link to="/"><ArrowLeft/></Link>
                    <div className="inLineDiv">
                    <p className="Subheading">Add a folder</p>
                    <button className="plusButton"><Plus/></button>
                    </div>
                    
                    <Accordion defaultActiveKey="0">
                        
                            {
                                folders.map((folder, idx)=>(
                                <Accordion.Item eventKey={idx} key={idx}>
                                    <Accordion.Header >{folder.folder}</Accordion.Header>
                                    <Accordion.Body>
                                    {
                                        folder.chats.map((chat, chatidx)=>(
                                            <div>
                                                <Link key={chatidx} to={`${chat.id}`}>{chat.name}</Link>
                                            </div>
                                        ))
                                    }
                                    </Accordion.Body>
                                </Accordion.Item>
                                ))
                            }
                    </Accordion>
                </div>
        </>
    )
}


export default MusicChatSideBar