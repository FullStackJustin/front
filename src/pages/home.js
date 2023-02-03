import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {

    const navigate = useNavigate();
    const usernameRef = useRef("")

    const saveUsername = () => {
        localStorage.setItem("username", usernameRef.current.value);
        navigate("/chooseroom")
    }

    return (
        <div className="w-screen h-screen bg-gray-300 ">
            <div className="pt-[45vh] mx-auto h-[25%] w-[25%] flex flex-col justify-center items-center ">
                <input type='text' placeholder="Create a Username" ref={usernameRef}></input>
                <button onClick={saveUsername} className="p-[10px] hover:border hover:bg-gray-600 hover:text-white hover:border-black ">Join</button>
            </div>
        </div>
    )
}
export default Home;