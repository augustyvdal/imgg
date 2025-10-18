// src/views/HigherLowerView.tsx
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Content } from "../services/apiClient";
import ChooseCategory from "../components/ChooseCategory";

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
    };

export default function HigherLowerView({contentA, contentB, score, category, message, showRatings, buttonsDisabled, gameOver, loading, chooseCategory, onGuess, prepareNewGame}: Props) {

    return (
        <div className="bg-gray-200 dark:bg-gray-900 min-h-screen flex flex-col items-center p-2 gap-2">
            <h1 className="text-black dark:text-white text-2xl flex font-sans font-bold">Higher or Lower</h1>
            {category === "" && <ChooseCategory onSelect={chooseCategory} />}

            {category !== "" && (
                <>
                    {loading ? (
                        <div
                            className="flex items-center gap-3 text-black dark:text-white py-8"
                            role="status"
                            aria-live="polite"
                            aria-busy="true"
                        >
                            <svg
                            className="h-6 w-6 animate-spin"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            >
                            <circle
                                className="opacity-25"
                                cx="12" cy="12" r="10"
                                stroke="currentColor" strokeWidth="4" fill="none"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            />
                            </svg>
                            <span>Loading…</span>
                        </div>
                        ) : (
                        <>
                            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg w-full max-w-7xl grid grid-cols-[1fr_auto_1fr] items-start gap-x-6">
                                <div className="flex flex-col items-center gap-1">
                                    <h3 className="text-black dark:text-white text-xl font-sans font-bold text-center w-full">{contentA?.title || contentA?.name}</h3>
                                    <img className="h-[480px] w-auto object-contain mb-2"
                                        src={`https://image.tmdb.org/t/p/w200${contentA?.poster_path}`}
                                        alt={contentA?.title || contentA?.name}
                                    />
                                    <p className="text-black dark:text-white text-2xl font-sans font-bold">Rating: {contentA?.vote_average}</p>
                                </div>

                                <div className="flex flex-col items-center justify-between h-3/7">
                                    <h2 className="text-black dark:text-white text-3xl flex font-sans font-bold">Current Score: {score}</h2>
                                    <div className="flex flex-col items-center gap-4">
                                        {message && <p className="text-black dark:text-white text-2xl font-sans font-bold">{message}</p>}
                                        {gameOver && <button className="bg-violet-600 hover:bg-violet-700 text-lg text-white cursor-pointer rounded disabled:opacity-60 font-bold w-full h-12" onClick={prepareNewGame}>Play Again!</button>}
                                        {/*gameOver && <button className="text-red-700 dark:text-red-400 hover:opacity-70 text-lg cursor-pointer border rounded w-full h-12 font-bold" onClick={() => window.location.href = "/"}>Main Menu</button>*/}
                                    </div>
                                </div>

                                <div className="flex flex-col items-center gap-1">
                                    <h3 className="text-black dark:text-white text-xl font-sans font-bold text-center w-full">{contentB?.title || contentB?.name}</h3>
                                    <img className="h-[480px] w-auto object-contain mb-2"
                                        src={`https://image.tmdb.org/t/p/w200${contentB?.poster_path}`}
                                        alt={contentB?.title || contentB?.name}
                                    />
                                    <p className="text-black dark:text-white text-2xl font-sans font-bold">{showRatings ? `Rating: ${contentB?.vote_average}` : "Rating: ???"}</p>
                                    <div className="flex gap-3 mt-4">
                                        <button className="bg-violet-600 hover:bg-violet-700 text-white text-lg cursor-pointer rounded h-12 w-38 disabled:opacity-60 font-bold" onClick={() => onGuess("higher")} disabled={buttonsDisabled}>Higher</button>
                                        <button className="bg-violet-600 hover:bg-violet-700 text-white text-lg cursor-pointerrounded h-12 w-38 disabled:opacity-60 font-bold" onClick={() => onGuess("lower")} disabled={buttonsDisabled}>Lower</button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}
        </div>     
    );
};
