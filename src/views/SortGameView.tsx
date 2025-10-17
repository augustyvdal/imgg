import { Content } from "../services/apiClient";
import ChooseCategory from "../components/ChooseCategory";

type SortGameViewProps = {
    content: Content[];
    onReorder: (fromIndex: number, toIndex: number) => void;
    onSubmit: () => void;
    onReset: () => void;
    feedback: string | null;
    onCategorySelect: (category: string) => void;
    category: string;
    triesLeft: number;
    shake: boolean;
    nextRound: boolean;
    reset: boolean;
    submit: boolean;
    onNextRound: () => void;
    streak: number;
};

function SortGameView({ content, onReorder, onSubmit, onReset, feedback, onCategorySelect, category, triesLeft, shake, nextRound, reset, submit, onNextRound, streak }: Readonly<SortGameViewProps>) {

    return (
        <div className="flex flex-col items-center gap-4">
            {category === "" && <ChooseCategory onSelect={onCategorySelect} />}


            {category !== "" && (
        <div>
            <ul className="flex flex-row gap-4 bg-gray-50 p-4 rounded-xl shadow-inner justify-center">
                {content.map((item, index) => (
                    <li
                    key={item.id}
                    className={`relative w-48 h-72 border rounded-lg shadow-md p-3 flex flex-col bg-white items-center overflow-hidden ${shake ? "shake" : ""}`}
                    draggable
                    onDragStart={(e) =>
                        e.dataTransfer.setData("fromIndex", index.toString())
                    }
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                        const fromIndex = parseInt(e.dataTransfer.getData("fromIndex"));
                        onReorder(fromIndex, index);
                    }}
                    >
                        <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
                            #{index + 1}
                        </div>
                        <p className="text-center text-sm font-medium mt-6 break-words leading-tight">
                            {item.title || item.name} <span className="text-gray-500 text-xs">({item.year})</span>
                        </p>
                        <img className="h-35 w-70 object-contain"
                            src={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
                            alt=""></img>
                    </li>
                    ))
                }
            </ul>
            
            {
                (submit) ? (
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    onClick={onSubmit}
                >
                    Submit
                </button>
                ): ""
            }

            {
                (nextRound) ? (
                <button 
                    className="px-4 py-2 bg-green-500 text-white rounded mt-3" 
                    onClick={onNextRound}
                >
                    Next Round!
                </button>
                ): ""
            }

            {
                (reset) ? (
                <button 
                    className="px-4 py-2 bg-red-500 text-white rounded mt-3" 
                    onClick={onReset}
                >
                    Reset
                </button>
                ): ""
            }

            {feedback && (
                <div className="mt-4 w-full max-w-xs bg-red-100 text-red-800 font-bold text-center text-lg px-4 py-2 rounded-lg shadow">
                    {feedback}
                </div>
            )}

            <div>{streak}</div>

            </div>
            )}
        </div>
    );
}

export default SortGameView;