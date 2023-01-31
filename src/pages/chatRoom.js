import io from "socket.io-client"
import { useEffect, useRef, useState } from 'react';
import '../styles/chatroom.css'

const socket = io.connect("http://localhost:3000");


const Chatroom = () => {
  const [userInput, setUserInput] = useState("")
  const today = new Date();
  const time = (today.getHours() > 12 ? today.getHours() - 12 : today.getHours()) + ":" + (today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes()) + " " + (today.getHours() > 12 ? "pm" : "am")

  const input = useRef('')

 

  //Function to send message
  const sendMsg = (e) => {
    e.preventDefault();
    if (userInput) {
      socket.emit("message", { message: userInput, time: time })
      setAllMsgs([...allMsgs, { time: time, message: userInput }])
      input.current.value = ""
    }
  }

  //UseEffect for only rendering once messageLog when sent and received and adding to chat log
  const messageLog = useRef("");
  const [allMsgs, setAllMsgs] = useState([]);
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setAllMsgs([...allMsgs, { time: data.time, message: data.message }])
    })
    return () => socket.off("receive_message")
  }, [allMsgs, socket])
  return (
    <div className="h-[100vh] w-[90vw] absolute top-0 left-[5vw] bg-blue-300 ">
      <div className="w-[80vw] my-[5vh] h-[75vh] bg-white py-[25px] rounded-lg mx-auto">
        <p className="shadow-lg text-center mb-[10px]">Messages:</p>
        <ul ref={messageLog} className="h-[90vh] overflow-y-scroll">
          <li>example message</li>
          {allMsgs.map((msg, index) => (
            <li key={index}>{`${msg.time} : ${msg.message}`}</li>
          ))}
        </ul>
      </div>
      <form className="sticky flex flex-row bottom-0 left-[10%] w-[75%] mx-auto justify-between ">
        <input className="border-[2.5px] bg-transparent hover:bg-white hover:text-gray-600 border-black w-[100%] rounded-lg" ref={input} placeholder="Message..." onChange={(e) => { setUserInput(e.target.value) }}></input>
        <button className="border-[2.5px] hover:border-green-500 hover:text-green-900 rounded-md ml-[5px] border-black" onClick={sendMsg}>Send</button>
      </form>
    </div>
  )
}

export default Chatroom;