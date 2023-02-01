import "../styles/privateroom.css";
import { useState, useEffect, useRef } from "react";

const PrivateRoom = ({ socket }) => {

    const msgRef = useRef("");
    const roomRef = useRef("");

    // Function to join room
    const [room, setRoom] = useState("");
    const [roomId, setRoomId] = useState("");
    const joinRoom = () => {
        if (room !== "") {
            socket.emit('join-room', { room: room })
            console.log(room, socket.id)
            roomRef.current.value = ""
            setRoomId(room)
        }
    }
    const leaveroom = () => {
        socket.emit("leave-room", room)
        setRoomId("")
        socket.off("receive_msg");
        socket.off("connect");
    }

    //Function to send message to server
    const [message, setMessage] = useState("");
    const [allMsgs, setAllMsgs] = useState([]);
    const sendMsg = (e) => {
        console.log(message)
        e.preventDefault();
        if (message) {
            socket.emit("send_msg", { message: message, room: room })
            setAllMsgs([...allMsgs, { message: message, room: room, sent: true }])
            msgRef.current.value = "";
        }
    }
    useEffect(() => {
        socket.on("receive_msg", (data) => {
            console.log(data)
            setAllMsgs([...allMsgs, { message: data.message, sent: false }]);
        })
        socket.on("connect", () => {
            console.log(socket.id)
        });
        
    }, [allMsgs])

    return (
        <div className="h-[100vh] w-[90vw] absolute top-0 left-[5vw] bg-blue-300 ">
            <div className="w-[80vw] my-[5vh] h-[75vh] bg-white py-[25px] rounded-lg mx-auto">
                <p className="absolute pl-[10px] ">Room:&nbsp;{roomId ? roomId : ""}</p>
                <p className="shadow-lg text-center mb-[10px]">Messages:</p>
                <ul className="h-[95%] overflow-y-scroll">
                    {allMsgs.map((msg, index) => (
                        <li className={`rounded-lg ${msg.sent ? "bg-[#50545d45]" : "bg-[#0049e5c6]"}`} key={index}>{`${msg.message}`}</li>
                    ))}
                </ul>
            </div>
            <div className="sticky flex flex-row bottom-0 left-[10%] w-[75%] mx-auto ">
                <input ref={roomRef} placeholder="Room number" onChange={(e) => { setRoom(e.target.value) }}></input>
                <button onClick={joinRoom}>Join</button>
                <button onClick={leaveroom}>Leave room</button>
            </div>
            <form className="sticky flex flex-row bottom-0 left-[10%] w-[75%] mx-auto justify-between ">
                <input ref={msgRef} className="border-[2.5px] bg-transparent hover:bg-white hover:text-gray-600 border-black w-[100%] rounded-lg" placeholder="Message..." onChange={(e) => { setMessage(e.target.value) }}></input>
                <button className="border-[2.5px] hover:border-green-500 hover:text-green-900 rounded-md ml-[5px] border-black" onClick={sendMsg}>Send</button>
            </form>
        </div>
    )
}

export default PrivateRoom;