import './App.css';
import io from "socket.io-client"
import { useEffect, useRef, useState } from 'react';

const socket = io.connect("http://localhost:3000");

function App() {
  const [userInput, setUserInput] = useState("")
  const [newMsg, setNewMsg] = useState("");
  const [time, setTime] = useState("");

  const input = useRef('')
  const sendMsg = (e) => {
    e.preventDefault();
    if (userInput){
      socket.emit("message", {message:userInput, time:new Date().getDate()})
      input.current.value = ""
    }
  }
  const messages = useRef("");
  useEffect(() => {
    socket.on("receive_message", (data) => {
      var receivedMsg = document.createElement("li");
      receivedMsg.textContent = data.time && data.message;
      messages.current.appendChild(receivedMsg);
    })
  },[socket])
  return (
    <div className="">
      <form>
        <input ref={input} placeholder="Message..." onChange={(e)=>{setUserInput(e.target.value)}}></input>
        <button onClick={sendMsg}>Send</button>
        <p>Messages:</p>
        <ul ref={messages}></ul>
      </form>
    </div>
  );
}

export default App;
