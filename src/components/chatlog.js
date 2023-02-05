import { useEffect, useRef, useState } from "react";
import '../styles/chatlog.css';

const Chatlog = (props) => {
    const { currentUser, allMsgs, msgRef, roomId, socket, setAllMsgs, message, room, setMessage } = props
    const time = new Date();
    const timeSent = (time.getHours() > 12 ? time.getHours() - 12 : time.getHours())
        + ":" + (time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes()) + (time.getHours() > 12 ? " pm" : " am")


    const sendMsg = (e) => {
        e.preventDefault();
        if (message) {
            socket.emit("send_msg", { message: message, time: timeSent, user: currentUser, room: room })
            setAllMsgs([...allMsgs, { message: message, time: timeSent, user: currentUser, room: room, sent: true }])
            msgRef.current.value = "";
            setTypingStatus(false)
        }
    }
    const handleTyping = () => {
        socket.emit('typing', { room:room, message:`${currentUser} is typing`});
    }
    const [typingStatus, setTypingStatus] = useState("");
    const lastMessageRef = useRef(null)
    const isTypingRef = useRef(null)
    socket.on('typingResponse', (data) => {
        setTypingStatus(data)
    })
    useEffect(() => {
        isTypingRef.current?.scrollIntoView({ behavior: 'smooth' });
    },[typingStatus])
    useEffect(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
        setTypingStatus("")
    }, [allMsgs,])
    useEffect(() => {
        setTypingStatus("")
    }, [allMsgs,])

    return (
        <div className="h-[100vh] w-[62.5vw] absolute top-0 right-0 bg-blue-300 ">
            {roomId ? <>
                <p className="absolute left-4 bottom-2 ">Currently Signed in as: {currentUser ? currentUser : ""}</p>
                <div id="chatlog" className="w-[50vw] my-[5vh] h-[75vh] bg-white py-[25px] rounded-lg mx-auto">
                    <p className="shadow-lg text-center mb-[10px]">Messages:</p>
                    <div id='messages' className="h-[95%] overflow-y-scroll">
                        {allMsgs.map((msg, index) => (
                            <div key={index} className="w-full py-[5px] my-[5px] inlineBlock">
                                <h6 className={`block ${msg.sent ? "text-end mr-[15px]" : "ml-[15px]"}`}>{`${msg.time}`}</h6>
                                <p ref={lastMessageRef} className={`rounded-lg block text-white ${msg.sent ? "text-end bg-[#2b2b2baa]" : "bg-[#0049e5c6]"}`} >{`${msg.user}`}: {`${msg.message}`}</p>
                            </div>
                        ))}
                            <header ref={isTypingRef} className='w-full text-center block'>{typingStatus?typingStatus+"...":""}</header>
                        
                    </div>
                </div>

                <form className="sticky flex flex-row bottom-6 left-[10%] w-[75%] mx-auto justify-between ">
                    <input onKeyDown={handleTyping} ref={msgRef} className="border-[2.5px] bg-transparent hover:bg-white hover:text-gray-600 border-black w-[100%] rounded-lg" placeholder="Message..." onChange={(e) => { setMessage(e.target.value) }}></input>
                    <button className="border-[2.5px] hover:border-green-500 hover:text-green-900 rounded-md ml-[5px] border-black" onClick={sendMsg}>Send</button>
                </form>
            </>
                :
                <>
                    <header className="m-auto text-white text-[3em] w-fit ">Please join a room</header>
                </>
            }
        </div>
    )
}
export default Chatlog;