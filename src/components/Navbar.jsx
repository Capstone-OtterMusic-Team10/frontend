import otter from '../assets/logo.png'
import { Link } from 'react-router'
const Navbar = () =>{
    return (
        <div id="navbar">
            <div id="leftNav">
                <Link to="/"><img className="navLogo" src={otter}/></Link>
            </div>
            <div id="rightNav">
                <Link className="navButtons" id="about" to="/about">About</Link>
                <button className="navButtons">Login</button>
                <button className="navButtons">Signup</button>
            </div>
        </div>
    )
}

export default Navbar