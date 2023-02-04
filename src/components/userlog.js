const Userlog = (props) => {
    const {roomId, users, setRoom, roomRef, leaveroom, joinRoom} = props
    return (
        <div id="userslog" className="absolute left-[2.5vw] w-[32.5vw] h-[100vh] bg-white overflow-y-scroll rounded-lg ">
            <div className="static w-full top-0 left-0 h-fit bg-black text-white ">
                <div className="text-center py-[2.5vh] pl-[10px] ">{roomId ? "Room: " + roomId :
                    <div className="flex flex-col md:flex-row lg:flex-row w-full mx-auto ">
                        <input ref={roomRef} className="max-w-[75%] mx-auto text-black " placeholder="Room number" onChange={(e) => { setRoom(e.target.value) }}></input>
                        <button className=" mt-[15px] md:mt-0 lg:mt-0 p-[5px] rounded-lg mx-auto w-fit border-dashed border border-gray-500 text-[.75rem] " onClick={joinRoom}>Join&nbsp;Room</button>
                    </div>
                }</div>
            </div>
            {roomId ? <header className="text-center pt-[15px] ">Active users:</header> : ""}
            <ul className="w-[32.5vw] h-[77.5vh] overflow-y-scroll overflow-x-hidden">
                {users.map((users, index) => (
                    <li className="rounded-lg text-black break-words max-w-[100%] " key={index}>{`${users}`}</li>
                ))}
            </ul>
            {roomId ? <span className="absolute bottom-[25px] text-center w-full">
                <button className="border border-black rounded-full px-[5px]" onClick={leaveroom}>Leave&nbsp;room</button>
            </span> : ""}
        </div>
    )
}
export default Userlog;