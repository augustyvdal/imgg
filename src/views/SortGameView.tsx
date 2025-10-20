import { Content } from "../services/apiClient";
import ChooseCategory from "../components/ChooseCategory";
import Spinner from "../components/Spinner";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import {InfoContent, Popup} from "../components/Popup";

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
    loading: boolean;
};

function SortGameView({ content, onReorder, onSubmit, onReset, feedback, onCategorySelect, category, triesLeft, shake, nextRound, reset, submit, onNextRound, streak, loading }: Readonly<SortGameViewProps>) {
    const [showInfo, setShowInfo] = useState(false);
    
    
    return (
        <div className="page-background">
            
           <div className="flex items-center gap-2 mb-6">
            <h1 className="text-3xl font-bold text-black dark:text-white">
                    Sort Game
                </h1>
                <button
                    onClick={() => setShowInfo((prev) => !prev)}
                    className="btn--info"
                    title="How to play"
                >
                    <FontAwesomeIcon icon={faInfoCircle} size="lg" />
                </button>
            </div>

            {showInfo && (
                <Popup onClose={() => setShowInfo(false)}>
                    <InfoContent onClose={() => setShowInfo(false)} />
                </Popup>
            )}

            <div className="flex flex-col items-center gap-4">
                {category === "" && <ChooseCategory onSelect={onCategorySelect} />}

                {category !== "" && (
                    <>
                        {loading ? (
                            <Spinner />
                        ) : (
                            <div>
                                <ul className="flex flex-row gap-4 bg-gray-200 dark:bg-gray-800 p-4 cursor-pointer rounded-xl shadow-inner justify-center transform scale-40 sm:scale-50 md:scale-75 lg:scale-90 xl:scale-110">
                                    {content.map((item, index) => (
                                        <li
                                        key={item.id}
                                        className={`bg-gray-50 dark:bg-gray-700 relative w-48 h-72 cursor-pointer data-cy="sort-item" rounded-lg p-3 flex flex-col items-center overflow-hidden ${shake ? "shake" : ""}`}
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
                                            <div className="absolute top-2 left-2 bg-col1 text-white text-xs cursor-pointer font-bold px-2 py-0.5 rounded-full">
                                                #{index + 1}
                                            </div>
                                            <p className="text-gray-800 dark:text-gray-300 text-center text-sm cursor-pointer font-medium mt-6 break-words leading-tight">
                                                {item.title || item.name} <span className="text-gray-500 text-xs">({item.year})</span>
                                            </p>
                                            <img className="h-40 w-80 object-contain"
                                                src={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
                                                alt=""></img>
                                        </li>
                                        ))
                                    }
                                </ul>
                            
                                <div className="flex flex-col items-center mt-4 gap-3">
                                    {
                                        (submit) ? (
                                        <button
                                            className="btn--default mt-4"
                                            data-cy="submit"
                                            onClick={onSubmit}
                                        >
                                            Submit
                                        </button>
                                        ): ""
                                    }

                                    {
                                        (nextRound) ? (
                                        <button 
                                            className="px-4 py-2 bg-col1 text-white cursor-pointer rounded mt-3" 
                                            data-cy="next-round"
                                            onClick={onNextRound}
                                        >
                                            Next Round!
                                        </button>
                                        ): ""
                                    }

                                    {
                                        (reset) ? (
                                        <button 
                                            className="px-4 py-2 bg-col1 text-white cursor-pointer rounded mt-3" 
                                            data-cy="reset"
                                            onClick={onReset}
                                        >
                                            Play Again!
                                        </button>
                                        ): ""
                                    }
                                

                                        {feedback && (
                                            <div className="mt-4 w-full max-w-xs bg-red-100 text-red-800 font-bold text-center text-lg px-4 py-2 rounded-lg shadow">
                                                {feedback}
                                            </div>
                                        )}

                                    <p className="mt-4 w-full max-w-xs bg-col2 text-white font-bold text-center text-lg px-4 py-2 rounded-lg shadow">Win streak: {streak}</p>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default SortGameView;