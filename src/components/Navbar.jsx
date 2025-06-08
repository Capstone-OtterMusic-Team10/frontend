import otter from '../assets/logo.png'
import { Link } from 'react-router'


const Navbar = () =>{
    return (
        <div id="navbar">
            <div id="leftNav">
                <Link to="/"><img className="navLogo" src={otter}/></Link>
            </div>
            <div id="rightNav">
                <button className="navButtons" id="logIn">Login</button>
                <button className="navButtons" id="signUp">Signup</button>
            </div>
        </div>
    )
    
}

export default Navbar