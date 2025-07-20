import Navbar from '../components/Navbar';
import Footer from '../components/Footer'
import { Outlet } from "react-router"

const Home = () => {
    return (
        <>
            <div className="home">
                <Navbar />
                <Outlet />
            </div>
            <Footer /> {/* Added Footer as suggested for consistency */}
        </>
    )
}

export default Home;