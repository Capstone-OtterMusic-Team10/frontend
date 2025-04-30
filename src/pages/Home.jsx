import prototype from '../assets/prototype.png';
import Navbar from '../components/Navbar';
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router';
import spotify from '../assets/spotify.png';
const Home = () =>{

    let navigate = useNavigate()

    return(
        <>
        
        <div className="home">
            <Navbar/>
            <div id="mainContent">
                <div className='leftPart'>
                    {/* gotta keep it a one liner */}
                    <h1 id="catchPhrase">Something to listen</h1>
                    <div id="content">
                        <button className='tryOutButton' onClick={()=>navigate("/chat")}><span className="buttonContent"><span id="separateText">Text To Music</span><Sparkles/></span></button>
                        <button className='tryOutButton' id="spot" onClick={()=>navigate("/chat")}><span className="buttonContent"><span id="separateText">Text To Playlist</span><img style={{width: 30}} src={spotify}></img></span></button>
                    </div>
                </div>
                <div className='rightPart'>
                    <img src={prototype} id="proto"></img>
                </div>
            </div>

        </div>
        </>
    )
}

export default Home