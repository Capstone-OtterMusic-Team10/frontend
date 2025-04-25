import prototype from '../assets/prototype.png';

const Home = () =>{
    return(
        <div className="home">
            <div id="mainContent">
                <div className='leftPart'>
                    <h1 id="catchPhrase">Turning Words to Waves</h1>
                </div>
                <div className='rightPart'>
                    <img src={prototype} id="proto"></img>
                </div>
            </div>
        </div>
    )
}

export default Home