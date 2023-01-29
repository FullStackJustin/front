import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Chatroom from './pages/chatRoom';
import Home from './pages/home';
import PrivateRoom from './pages/privateRoom';

function App() {

  return (
   <Router>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/chatroom" element={<Chatroom/>}/>
      <Route path="/privateroom" element={<PrivateRoom/>}/>
    </Routes>
   </Router>
  );
}

export default App;
