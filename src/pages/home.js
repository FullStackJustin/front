const Home = () => {
    return (
        <div className="w-screen h-screen bg-gray-300 ">
            <div className="pt-[45vh] mx-auto h-[25%] w-[25%] flex flex-col justify-center items-center ">
                <button><a className="p-[10px] hover:border hover:bg-gray-600 hover:text-white hover:border-black " href="/chatroom">Main&nbsp;Chat&nbsp;Room</a></button>
                <p className="my-[5px]">Or</p>
                <button><a className="p-[10px] hover:border hover:bg-gray-600 hover:text-white hover:border-black " href="/privateroom">Private&nbsp;Chat&nbsp;Room</a></button>
            </div>
        </div>
    )
}
export default Home;