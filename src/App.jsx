import './App.css'
import Home from './pages/Home'
import About from './pages/About';
import MusicChat from './pages/MusicChat';
import MusicSubChat from './pages/MusicSubChat';
//import MusicEdit from './pages/MusicEdit'
import HomeMainView from './components/HomeMainView';
import Login from './pages/Login';
import LoginView from './components/LoginView';
import Signup from './pages/SignUp';
import SignupView from './components/SignUpView';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />}>
              <Route index element={<HomeMainView />} />
              <Route path="about" element={<About />} />
            </Route>

            <Route path="/chat" element={<MusicChat />}>
              <Route path=":chatId" element={<MusicSubChat />} />
            </Route>

            {/* <Route path="/create-playlist" element={<MusicEdit />} /> */}

            <Route path="/login" element={<Login />}>
              <Route index element={<LoginView />} />
            </Route>

            <Route path="/signup" element={<Signup />}>
              <Route index element={<SignupView />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
  );
}

export default App;
