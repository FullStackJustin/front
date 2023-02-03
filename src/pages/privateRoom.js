import "../styles/privateroom.css";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"

const PrivateRoom = ({ socket }) => {

    //Variables
    const navigate = useNavigate();
    const msgRef = useRef("");
    const roomRef = useRef("");
    const currentUser = localStorage.getItem('username');
    const [users, setUsers] = useState([]);


    //Leave the Room and reset username locally
    const leaveroom = () => {
        if (room !== "") {
            socket.emit("leave-room", {room:room, user: currentUser});
            setRoomId("");
            localStorage.removeItem('username')
            socket.off("receive_msg");
            socket.off("connect");
            navigate('/')
        } else {
            return
        }
    }

    //Function to send message to server
    const [message, setMessage] = useState("");
    const [allMsgs, setAllMsgs] = useState([]);
    const sendMsg = (e) => {
        e.preventDefault();
        if (message) {
            socket.emit("send_msg", { message: message, room: room })
            setAllMsgs([...allMsgs, { message: message, room: room, sent: true }])
            msgRef.current.value = "";
            
        }
    }

    
    const [room, setRoom] = useState("");
    const [roomId, setRoomId] = useState("");
    const [connectedUser, setConnectedUser] = useState('')
    useEffect(() => {
        socket.on("receive_msg", (data) => {
            setAllMsgs([...allMsgs, { message: data.message, sent: false }]);
        })
        socket.on("connect", () => {
            console.log(socket.id, currentUser);
            setConnectedUser(currentUser);
            socket.emit('connectedUsers')
        });
        socket.on("connectedUsers", (data) => {
            setUsers(data);
        })
        return () => {
            socket.off("receive_msg");
            socket.off("connect");
            socket.off("connectedUsers");
        }

    }, [allMsgs, users, connectedUser, currentUser, socket])
    // Function to join room, set room id to current room, send current user to backend
    const joinRoom = () => {
        if (room !== "") {
            socket.emit('join-room', { room: room, user:currentUser })
            console.log(room, socket.id)
            roomRef.current.value = ""
            setRoomId(room)
            socket.emit('getConnectedUsers', currentUser)
            socket.on("updateUserlog", (data) => {
                setUsers(data);
            });
        }
    }


    return (
        <div>
            <div id="userslog" className="absolute left-[2.5vw] w-[32.5vw] h-[100vh] bg-white overflow-y-scroll rounded-lg ">
                <div className="static w-full top-0 left-0 h-fit bg-black text-white ">
                    <p className="text-center py-[2.5vh] pl-[10px] ">{roomId ? "Room: " + roomId :
                        <div className="flex flex-col md:flex-row lg:flex-row w-full mx-auto ">
                            <input ref={roomRef} className="max-w-[75%] mx-auto text-black " placeholder="Room number" onChange={(e) => { setRoom(e.target.value) }}></input>
                            <button className=" mt-[15px] md:mt-0 lg:mt-0 p-[5px] rounded-lg mx-auto w-fit border-dashed border border-gray-500 text-[.75rem] " onClick={joinRoom}>Join&nbsp;Room</button>
                        </div>
                    }</p>
                </div>
                {roomId?<header className="text-center pt-[15px] ">Active users:</header>:""}
                <ul className="w-[32.5vw] h-[77.5vh] overflow-y-scroll overflow-x-hidden">
                    {users.map((users, index) => (
                        <li className="rounded-lg text-black break-words max-w-[100%] " key={index}>{`${users}`}</li>
                    ))}
                </ul>
                {roomId?<span className="absolute bottom-[25px] text-center w-full">
                    <button className="border border-black rounded-full px-[5px]" onClick={leaveroom}>Leave&nbsp;room</button>
                </span>:""}
            </div>
            <div className="h-[100vh] w-[60vw] absolute top-0 right-[2.5vw] bg-blue-300 ">
                <p className="absolute left-4 bottom-2 ">Currently Signed in as: {currentUser?currentUser:""}</p>
                <div id="chatlog" className="w-[50vw] my-[5vh] h-[75vh] bg-white py-[25px] rounded-lg mx-auto">
                    <p className="shadow-lg text-center mb-[10px]">Messages:</p>
                    <ul className="h-[95%] overflow-y-scroll">
                        {allMsgs.map((msg, index) => (
                            <li className={`rounded-lg text-white ${msg.sent ? "text-end bg-[#2b2b2baa]" : "bg-[#0049e5c6]"}`} key={index}>{`${msg.message}`}</li>
                        ))}
                    </ul>
                </div>

                <form className="sticky flex flex-row bottom-6 left-[10%] w-[75%] mx-auto justify-between ">
                    <input ref={msgRef} className="border-[2.5px] bg-transparent hover:bg-white hover:text-gray-600 border-black w-[100%] rounded-lg" placeholder="Message..." onChange={(e) => { setMessage(e.target.value) }}></input>
                    <button className="border-[2.5px] hover:border-green-500 hover:text-green-900 rounded-md ml-[5px] border-black" onClick={sendMsg}>Send</button>
                </form>
            </div>
        </div>
    )
}

export default PrivateRoom;