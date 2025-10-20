// src/views/HigherLowerView.tsx
import React, { useState } from "react";
import { Content } from "../services/apiClient";
import ChooseCategory from "../components/ChooseCategory";
import Spinner from "../components/Spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import {InfoContent, Popup} from "../components/Popup";

type Props = {
        contentA: Content | null;
        contentB: Content | null;
        score: number;
        category: string;
        message: string;
        showRatings: boolean;
        buttonsDisabled: boolean;
        gameOver: boolean;
        loading: boolean;
        chooseCategory: (category: "movie" | "tv") => void;
        onGuess: (guess: "higher" | "lower") => void;
        prepareNewGame: () => void;
        goToHome: () => void;
    };

export default function HigherLowerView({contentA, contentB, score, category, message, showRatings, buttonsDisabled, gameOver, loading, chooseCategory, onGuess, prepareNewGame, goToHome}: Props) {
    const [showInfo, setShowInfo] = useState(false);
    
    return (
        <div className="page-background flex flex-col items-center p-6">
           <div className="flex items-center gap-2 mb-6">
            <button className="btn--default absolute left-6" onClick={goToHome}>Game Hub</button>

            <h1 className="text-3xl font-bold text-black dark:text-white">
                    Higher or Lower?
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
            
            {category === "" && <ChooseCategory onSelect={chooseCategory} />}

            {category !== "" && (
                <>
                    {loading ? (
                        <Spinner />
                    ) : (
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg w-full max-w-7xl grid grid-cols-[1fr_auto_1fr] items-start gap-x-6">
                            <div className="flex flex-col items-center gap-1">
                                <h3 className="text-black dark:text-white text-xl font-sans font-bold text-center w-full">{contentA?.title || contentA?.name}</h3>
                                <img className="h-[350px] w-auto object-contain mb-2"
                                    src={`https://image.tmdb.org/t/p/w200${contentA?.poster_path}`}
                                    alt={contentA?.title || contentA?.name}
                                />
                                <p className="text-black dark:text-white text-2xl font-sans font-bold">Rating: {contentA?.vote_average}</p>
                            </div>

                            <div className="flex flex-col items-center justify-between h-3/7">
                                <h2 className="mt-4 w-full max-w-xs bg-col2 text-white font-bold text-center text-lg px-4 py-2 rounded-lg shadow">Current Score: {score}</h2>
                                <div className="flex flex-col items-center gap-4">
                                    {message && <p className="text-black dark:text-white text-2xl font-sans font-bold">{message}</p>}
                                    {gameOver && <button className="btn--default" onClick={prepareNewGame}>Play Again!</button>}
                                </div>
                            </div>


                            <div className="flex flex-col items-center gap-1">
                                <h3 className="text-black dark:text-white text-xl font-sans font-bold text-center w-full">{contentB?.title || contentB?.name}</h3>
                                <img className="h-[350px] w-auto object-contain mb-2"
                                    src={`https://image.tmdb.org/t/p/w200${contentB?.poster_path}`}
                                    alt={contentB?.title || contentB?.name}
                                />
                                <p className="text-black dark:text-white text-2xl font-sans font-bold">{showRatings ? `Rating: ${contentB?.vote_average}` : "Rating: ???"}</p>
                                <div className="flex gap-3 mt-4">
                                    <button className="btn--default" onClick={() => onGuess("higher")} disabled={buttonsDisabled}>Higher</button>
                                    <button className="btn--default" onClick={() => onGuess("lower")} disabled={buttonsDisabled}>Lower</button>
                                </div>
                            </div>
                        </div>
                        

                    )}
                </>
            )}
        </div>     
    );
};
