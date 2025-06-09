import prototype from '../assets/prototype.png';
import spotify from '../assets/spotify.png';
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router';
import Footer from './Footer';
const HomeMainView = () =>{
    let navigate = useNavigate()
    return (
        <>
        <div id='about'>
            <div id="mainContent">
                <div className='rightPart'>
                    <img src={prototype} id="proto"></img>
                </div>
                <div className='leftPart'>
                    {/* gotta keep it a one liner */}
                    <div id="content">
                        <h1 id="catchPhrase">Welcome to Otter Music 🎵</h1>
                    
                        <button className='tryOutButton' onClick={()=>navigate("/chat")}><span className="buttonContent"><span id="separateText">Text To Melodies</span><Sparkles size={30}/></span></button>
                        <button className='tryOutButton' id="spot" onClick={()=>navigate("/create-playlist")}><span className="buttonContent"><span id="separateText">Text To Playlist</span><img style={{width: 30}} src={spotify}></img></span></button>
                    </div>
                </div>
            </div>
        </div>
            <Footer />
        </>
    )
}

export default HomeMainView