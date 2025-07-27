import prototype from '../assets/prototype.png';
import { Sparkles, Wrench } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import Footer from '../components/Footer';
import About from './About';
const HomeMainView = () =>{
    let navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            localStorage.setItem('token', token);
            navigate('/', { replace: true });  // Changed to / (root) to clean URL
        }
    }, [searchParams, navigate]);

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
                            <button className='tryOutButton' id="spot" onClick={()=>navigate("/create-playlist")}><span className="buttonContent"><span id="separateText">Editing Workbench</span><Wrench size={30}/></span></button>
                        </div>
                    </div>
                </div>
                <About/>
            </div>
            <Footer />
        </>
    )
}

export default HomeMainView