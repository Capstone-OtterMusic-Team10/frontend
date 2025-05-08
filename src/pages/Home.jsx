
import Navbar from '../components/Navbar';

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