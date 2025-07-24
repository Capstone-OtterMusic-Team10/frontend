import otter from '../assets/logo.png'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';


const Navbar = () =>{
    const navigate = useNavigate();
    const token = localStorage.getItem("token")
    return (
        <div id="navbar">
            <div id="leftNav">
                <Link to="/"><img className="navLogo" src={otter}/></Link>
            </div>
            <div id="rightNav">
                <button className="navButtons" onClick={() => navigate('/music-mixer')}>
                    Music Mixer
                </button>
                {!token ?
                <>
                    <button className="navButtons" id="logIn" onClick={() => navigate('/login')}>
                        Login
                    </button>
                    <button className="navButtons" id="signUp" onClick={() => navigate('/signup')}>
                        Signup
                    </button>
                </>
                :
                <button className="navButtons" id="logout" onClick={() => {
                    localStorage.removeItem("token")
                    navigate('/login')
                    }}>
                    Logout
                </button>
                }
                </div>
                
        </div>
    )
    
}

export default Navbar