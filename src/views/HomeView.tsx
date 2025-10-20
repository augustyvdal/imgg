
type Props = {
  onStartGuessTheMovie: () => void;
  onStartHigherLower: () => void;
  onStartSortGame: () => void;
};

export default function HomeView({ onStartGuessTheMovie, onStartHigherLower, onStartSortGame }: Props) {
    return (
        <div className="page-background">
            <div className="mt-5 col-start-3 row-start-3 flex flex-col bg-white dark:bg-gray-800 p-5 rounded-lg items-center-safe">
                <img alt="logo" className="max-h-70 max-w-70 rounded-2xl" src="/logo.png"/>
                <div className="col-start-3 row-start-3 flex max-w-lg flex-col">
                    <div className='text-black dark:text-white text-xl p-1 flex justify-center font-sans font-bold'>The internet movie guessing games!</div>
                </div>
                
                <div className="flex flex-col space-y-4 mt-4">
                    <button className="btn--default" data-cy="start-guess" onClick={onStartGuessTheMovie}>Guess the Movie</button>
                    <button className="btn--default" data-cy="start-higher" onClick={onStartHigherLower}>Higher / Lower</button>
                    <button className="btn--default" data-cy="start-sort" onClick={onStartSortGame}>Sort Game</button>
            </div>
            </div>
        </div>
    );
}


