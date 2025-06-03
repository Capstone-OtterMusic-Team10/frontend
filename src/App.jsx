import './App.css'
import Home from './pages/Home'
import About from './pages/About';
import MusicChat from './pages/MusicChat';
import MusicSubChat from './pages/MusicSubChat';
import SpotifyPage from './pages/SpotifyPage';
import HomeMainView from './components/HomeMainView';
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  return (
    <Router>
      <Routes>
      <Route path="/" element={<Home />}>
        <Route index element={<HomeMainView/>}/>
        <Route path="/about" element={<About />} />
      </Route>
      <Route path="/chat" element={<MusicChat />}>
        <Route path=":chatId" element={<MusicSubChat/>}/>
      </Route>
      <Route path="/create-playlist" element={<SpotifyPage />} />
      </Routes>
    </Router>
  )
}

export default App
