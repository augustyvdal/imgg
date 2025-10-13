function GameSelector() {
    return (
        <div class="relative grid min-h-screen grid-cols-[1fr_2.5rem_auto_2.5rem_1fr] grid-rows-[1fr_1px_auto_1px_1fr] bg-white">
            <div class="col-start-3 row-start-3 flex max-w-lg flex-col place-content-center">
                <img src="src\images\logo.png"/>
                <div class="col-start-3 row-start-3 flex max-w-lg flex-col">
                    <div class='text-stone-950 flex justify-center'>The internet movie guessing game</div>
                </div>
            </div>
        </div>
        
    );
}

export default GameSelector;
