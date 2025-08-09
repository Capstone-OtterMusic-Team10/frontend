import otter from '../assets/logo.png'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { api } from '../utils'; // Assuming api is your Axios instance from utils

const Navbar = () =>{
    const navigate = useNavigate();
    const token = localStorage.getItem("token")
    const handleLogout = async () => {
        try {
            if (token) {
                await api.post('/logout', {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }
            localStorage.removeItem("token");
            navigate('/login');
        } catch (error) {
            console.error("Logout failed:", error);
            localStorage.removeItem("token"); // Clear anyway
            navigate('/login');
        }
    };
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
                    <button className="navButtons" id="logout" onClick={handleLogout}>
                        Logout
                    </button>
                }
            </div>

        </div>
    )

}

export default Navbar