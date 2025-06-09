
import Navbar from '../components/Navbar';
import Footer from '../components/Footer'
import { Outlet } from "react-router"

const Home = () =>{



    return(
        <>
        <div className="home">
            <Navbar/>     
            <Outlet/>
            
        </div>
        </>
    )
}

export default Home