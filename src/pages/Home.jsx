
import Navbar from '../components/Navbar';
import Footer from '../components/Footer'
import { Outlet } from "react-router"

const Home = () =>{



    return(
        <>

            <Navbar/>     
            <Outlet/>
            
        </>
    )
}

export default Home