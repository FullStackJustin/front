const Chatlog = (props) => {
    const {currentUser, allMsgs, msgRef, socket, setAllMsgs, message, room, setMessage} = props

    const sendMsg = (e) => {
        e.preventDefault();
        if (message) {
            socket.emit("send_msg", { message: message, user:currentUser, room: room })
            setAllMsgs([...allMsgs, { message: message, user:currentUser, room: room, sent: true }])
            msgRef.current.value = "";
            
        }
    }
    return (
        <div className="h-[100vh] w-[60vw] absolute top-0 right-[2.5vw] bg-blue-300 ">
        <p className="absolute left-4 bottom-2 ">Currently Signed in as: {currentUser?currentUser:""}</p>
        <div id="chatlog" className="w-[50vw] my-[5vh] h-[75vh] bg-white py-[25px] rounded-lg mx-auto">
            <p className="shadow-lg text-center mb-[10px]">Messages:</p>
            <ul className="h-[95%] overflow-y-scroll">
                {allMsgs.map((msg, index) => (
                    <li className={`rounded-lg text-white ${msg.sent ? "text-end bg-[#2b2b2baa]" : "bg-[#0049e5c6]"}`} key={index}>{`${msg.user}`}: {`${msg.message}`}</li>
                ))}
            </ul>
        </div>

        <form className="sticky flex flex-row bottom-6 left-[10%] w-[75%] mx-auto justify-between ">
            <input ref={msgRef} className="border-[2.5px] bg-transparent hover:bg-white hover:text-gray-600 border-black w-[100%] rounded-lg" placeholder="Message..." onChange={(e) => { setMessage(e.target.value) }}></input>
            <button className="border-[2.5px] hover:border-green-500 hover:text-green-900 rounded-md ml-[5px] border-black" onClick={sendMsg}>Send</button>
        </form>
    </div>
    )
}
export default Chatlog;