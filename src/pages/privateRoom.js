import "../styles/privateroom.css";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"
import Userlog from "../components/userlog";
import Chatlog from "../components/chatlog";

const PrivateRoom = ({ socket }) => {

    //Variables
    const navigate = useNavigate();
    const msgRef = useRef("");
    const roomRef = useRef("");
    const currentUser = localStorage.getItem('username');
    const [users, setUsers] = useState([]);
    const [userActivity, setUserActivity] = useState([]);

    //Leave the Room and reset username locally
    const leaveroom = () => {
        if (room !== "") {
            socket.emit("leave-room", { room: room, user: currentUser });
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



    const [room, setRoom] = useState("");
    const [roomId, setRoomId] = useState("");
    const [connectedUser, setConnectedUser] = useState('')
    useEffect(() => {
        socket.on("receive_msg", (data) => {
            setAllMsgs([...allMsgs, { message: data.message, user: data.user, sent: false }]);
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
            socket.emit('join-room', { room: room, user: currentUser })
            console.log(room, socket.id)
            roomRef.current.value = ""
            setRoomId(room)
            socket.emit('getConnectedUsers', currentUser)
            socket.on("updateUserlog", (data) => {
                setUsers(data);
            });
            setUserActivity([...userActivity, { user: currentUser }])
        }
    }


    return (
        <div>
            <Userlog roomId={roomId} users={users}
                setRoom={setRoom} roomRef={roomRef}
                leaveroom={leaveroom} joinRoom={joinRoom}>
            </Userlog>
            <Chatlog room={room} currentUser={currentUser}
                socket={socket} setAllMsgs={setAllMsgs}
                allMsgs={allMsgs} msgRef={msgRef} message={message}
                setMessage={setMessage}>
            </Chatlog>
        </div>
    )
}

export default PrivateRoom;