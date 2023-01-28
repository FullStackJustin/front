import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Chatroom from './pages/chatRoom';
import Home from './pages/home';

function App() {

  return (
   <Router>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/chatroom" element={<Chatroom/>}/>
    </Routes>
   </Router>
  );
}

export default App;
