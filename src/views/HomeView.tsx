
type Props = {
  onStartGuessTheMovie: () => void;
  onStartHigherLower: () => void;
  onStartSortGame: () => void;
};

export default function HomeView({ onStartGuessTheMovie, onStartHigherLower, onStartSortGame }: Props) {
    return (
        <div className="relative grid min-h-screen grid-cols-[1fr_2.5rem_auto_2.5rem_1fr] grid-rows-[1fr_1px_auto_1px_1fr] bg-gray-200 dark:bg-gray-900">
            <div className="col-start-3 row-start-3 flex max-w-lg flex-col place-content-center bg-white dark:bg-gray-800 p-5 rounded-lg items-center-safe">
                <img alt="logo" className="max-h-70 max-w-70 rounded-2xl" src="/logo.png"/>
                <div className="col-start-3 row-start-3 flex max-w-lg flex-col">
                    <div className='text-black dark:text-white text-xl p-1 flex justify-center font-sans font-bold'>The internet movie guessing games!</div>
                </div>
                
                <div className="flex flex-col space-y-4 mt-4">
                <button className="bg-violet-600 hover:bg-violet-700 text-white text-lg cursor-pointer rounded px-14 py-2 disabled:opacity-60 font-bold" onClick={onStartGuessTheMovie}>Guess The Movie</button>
                <button className="bg-violet-600 hover:bg-violet-700 text-white text-lg cursor-pointer rounded px-14 py-2 disabled:opacity-60 font-bold" onClick={onStartHigherLower}>Higher or Lower</button>
                <button className="bg-violet-600 hover:bg-violet-700 text-white text-lg cursor-pointer rounded px-14 py-2 disabled:opacity-60 font-bold" onClick={onStartSortGame}>Sort Game</button>
            </div>
            </div>
        </div>
    );
}


