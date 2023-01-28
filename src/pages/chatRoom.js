import io from "socket.io-client"
import { useEffect, useRef, useState } from 'react';
import '../styles/chatroom.css'

const socket = io.connect("http://localhost:3000");


const Chatroom = () => {
    const [userInput, setUserInput] = useState("")
    const today = new Date();
    const time = (today.getHours() > 12 ? today.getHours()-12 : today.getHours() ) + ":" + (today.getMinutes()<10 ? "0"+today.getMinutes():today.getMinutes()) + " " + (today.getHours() > 12 ? "pm" : "am")
  
    const input = useRef('')
    const sendMsg = (e) => {
      e.preventDefault();
      if (userInput){
        socket.emit("message", {message:userInput, time:time})
        input.current.value = ""
      }
    }
    const messages = useRef("");
    useEffect(() => {
      socket.on("receive_message", (data) => {
        var receivedMsg = document.createElement("li");
        receivedMsg.textContent = `${data.time + " : " + data.message}`
        messages.current.appendChild(receivedMsg);
      })
      return () => socket.off("receive_message")
    },[])
    return (
        <div className="h-[100vh] ">
        <div className="w-screen">
          <p className="shadow-lg text-center mb-[10px]">Messages:</p>
          <ul ref={messages} className="h-[90vh] overflow-y-scroll">
            <li>example message</li>
          </ul>
        </div>
        <form className="sticky flex flex-row bottom-0 left-[10%] w-[75%] mx-auto justify-between ">
          <input  className="border-[5px] hover:bg-black hover:text-white border-black w-[100%] " ref={input} placeholder="Message..." onChange={(e)=>{setUserInput(e.target.value)}}></input>
          <button className="border-[5px] hover:bg-black hover:text-white border-blue-400"  onClick={sendMsg}>Send</button>
        </form>
      </div>
    )
}

export default Chatroom;