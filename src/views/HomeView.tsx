export default function GeneralView() {
    
    return (
        <div class="relative grid min-h-screen grid-cols-[1fr_2.5rem_auto_2.5rem_1fr] grid-rows-[1fr_1px_auto_1px_1fr] bg-white dark:bg-gray-900">
            <div class="col-start-3 row-start-3 flex max-w-lg flex-col place-content-center bg-white dark:bg-gray-800 p-5 rounded-lg">
                <img src="src\images\logo.png"/>
                <div class="col-start-3 row-start-3 flex max-w-lg flex-col">
                    <div class='text-black dark:text-white text-xl flex justify-center font-sans font-bold'>The internet movie guessing game</div>
                </div>
                
                <div class="flex flex-col space-y-4 mt-4">
                <button onClick={() => window.location.href = "/game1"}>Go to Guess The Movie</button>
                <button onClick={() => window.location.href = "/game2"}>Go to Higher or Lower</button>
                <button onClick={() => window.location.href = "/game3"}>Go to Sort Game</button>
            </div>
            </div>
        </div>
    );
}


