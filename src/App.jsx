import './App.css'
import Home from './pages/Home'
import MusicChat from './pages/MusicChat';
import MusicSubChat from './pages/MusicSubChat';
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  return (
    <Router>
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chat" element={<MusicChat />}>
        <Route path=":chatId" element={<MusicSubChat/>}/>
      </Route>
      </Routes>
    </Router>
  )
}

export default App
