import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Chatroom from './pages/chatRoom';
import Home from './pages/home';
import {io} from "socket.io-client"
import PrivateRoom from './pages/privateRoom';
import ChooseRoom from './pages/chooseRoom';

function App() {
  const socket = io.connect("http://localhost:8000");
  return (
   <Router>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/chooseroom" element={<ChooseRoom/>}/>
      <Route path="/chatroom" element={<Chatroom socket={socket}/>}/>
      <Route path="/privateroom" element={<PrivateRoom socket={socket}/>}/>
    </Routes>
   </Router>
  );
}

export default App;
