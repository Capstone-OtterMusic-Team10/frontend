import prototype from '../assets/prototype.png';
import Navbar from '../components/Navbar';
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router';
const Home = () =>{

    let navigate = useNavigate()

    return(
        <>
        
        <div className="home">
            <Navbar/>
            <div id="mainContent">
                <div className='leftPart'>
                    <h1 id="catchPhrase">Something to listen<span id='caret'>|</span></h1>
                </div>
                <div className='rightPart'>
                    <img src={prototype} id="proto"></img>
                </div>
            </div>
            <div id="content">
                <button id='tryOutButton' onClick={()=>navigate("/chat")}><span className="buttonContent"><span id="separateText">Try it out</span><Sparkles/></span></button>
            </div>
        </div>
        </>
    )
}

export default Home