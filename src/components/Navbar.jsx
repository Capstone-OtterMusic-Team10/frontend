import otter from '../assets/logo.png'
import { Link, useNavigate } from 'react-router-dom'

const Navbar = () =>{
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div id="navbar">
            <div id="leftNav">
                <Link to="/"><img className="navLogo" src={otter}/></Link>
            </div>
            <div id="rightNav">
                {token ? (
                    <button className="navButtons" id="logout" onClick={handleLogout}>
                        Logout
                    </button>
                ) : (
                    <>
                        <button className="navButtons" id="logIn" onClick={() => navigate('/login')}>
                            Login
                        </button>
                        <button className="navButtons" id="signUp" onClick={() => navigate('/signup')}>
                            Signup
                        </button>
                    </>
                )}
            </div>
        </div>
    )

}

export default Navbar