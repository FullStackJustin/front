import "../styles/privateroom.css";
const { useState, useEffect } = require("react");
const { io } = require("socket.io-client");

const PrivateRoom = () => {

    const socket = io.connect("http://localhost:3000");

    // Function to join room
    const [room, setRoom] = useState("");
    const joinRoom = () => {
        if (room !== "") {
            socket.emit('join', {room:room})
            console.log(room)
        }
    }

    //Function to send message to server
    const [message, setMessage] = useState("");
    const [messageReceived, setMessageReceived] = useState("");
    const [allMsgs, setAllMsgs] = useState([]);
    const sendMsg = (e) => {
        e.preventDefault();
        if(message){
            socket.emit("send_msg", {message, room})
            setAllMsgs([...allMsgs, {message:message}])
        }
    }
    useEffect(() => {
        socket.on("receive_message", (data) => {
            console.log(data)
            setAllMsgs([...allMsgs, {message:data.message}]);
        })
        return() => socket.off("incoming_message")
    },[])

    return (
        <div className="h-[100vh] w-[90vw] absolute top-0 left-[5vw] bg-blue-300 ">
            <div className="w-[80vw] my-[5vh] h-[75vh] bg-white py-[25px] rounded-lg mx-auto">
                <p className="shadow-lg text-center mb-[10px]">Messages:</p>
                <ul className="h-[95%] overflow-y-scroll">
                    <li>example message</li>
                    {allMsgs.map((msg, index) => (
                        <li key={index}>{`${msg.message}`}</li>
                    ))}
                </ul>
            </div>
            <div>
                <input placeholder="Room number" onChange={(e) => {setRoom(e.target.value)}}></input>
                <button onClick={joinRoom}>Join</button>
            </div>
            <form className="sticky flex flex-row bottom-0 left-[10%] w-[75%] mx-auto justify-between ">
                <input className="border-[2.5px] bg-transparent hover:bg-white hover:text-gray-600 border-black w-[100%] rounded-lg" placeholder="Message..." onChange={(e) => { setMessage(e.target.value) }}></input>
                <button className="border-[2.5px] hover:border-green-500 hover:text-green-900 rounded-md ml-[5px] border-black" onClick={sendMsg}>Send</button>
            </form>
        </div>
    )
}

export default PrivateRoom;