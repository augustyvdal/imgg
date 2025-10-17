export default function GeneralView() {
    
    return (
        <div className="relative grid min-h-screen grid-cols-[1fr_2.5rem_auto_2.5rem_1fr] grid-rows-[1fr_1px_auto_1px_1fr] bg-gray-200 dark:bg-gray-900">
            <div className="col-start-3 row-start-3 flex max-w-lg flex-col place-content-center bg-white dark:bg-gray-800 p-5 rounded-lg">
                <img src="src\images\logo.png"/>
                <div className="col-start-3 row-start-3 flex max-w-lg flex-col">
                    <div className='text-black dark:text-white text-xl flex justify-center font-sans font-bold'>The internet movie guessing game</div>
                </div>
                
                <div className="flex flex-col space-y-4 mt-4">
                <button className="bg-yellow-400 hover:bg-yellow-500 text-black rounded px-4 py-2 disabled:opacity-60 font-bold" onClick={() => window.location.href = "/game1"}>Go to Guess The Movie</button>
                <button className="bg-yellow-400 hover:bg-yellow-500 text-black rounded px-4 py-2 disabled:opacity-60 font-bold" onClick={() => window.location.href = "/game2"}>Go to Higher or Lower</button>
                <button className="bg-yellow-400 hover:bg-yellow-500 text-black rounded px-4 py-2 disabled:opacity-60 font-bold" onClick={() => window.location.href = "/game3"}>Go to Sort Game</button>
            </div>
            </div>
        </div>
    );
}


