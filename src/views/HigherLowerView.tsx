// src/views/HigherLowerView.tsx
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Content } from "../services/apiClient";
import "../styles/Higherlower.css"
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
        chooseCategory: (category: "movie" | "tv") => void;
        onGuess: (guess: "higher" | "lower") => void;
        prepareNewGame: () => void;
    };

export default function HigherLowerView({contentA, contentB, score, category, message, showRatings, buttonsDisabled, gameOver, chooseCategory, onGuess, prepareNewGame}: Props) {

    return (
        <div class="bg-white dark:bg-gray-900 min-h-screen flex flex-col place-items-center-safe">
            <h1 class="text-black dark:text-white text-xl flex font-sans font-bold">Higher or Lower</h1>
            {category === "" && <ChooseCategory onSelect={chooseCategory} />}

            {category !== "" && (
                <>
                <h2 class="text-black dark:text-white text-lg flex font-sans font-bold">Score: {score}</h2>
                
                <div class="col-start-3 row-start-3 flex max-w-lg flex-row place-content-center bg-white dark:bg-gray-800 p-5 rounded-lg">
                    <div class="flex flex-col p-5 place-items-center-safe">
                        <h3 class="text-black dark:text-white text-xl font-sans font-bold">{contentA?.title || contentA?.name}</h3>
                        <img class="h-60 w-120 object-contain"
                            src={`https://image.tmdb.org/t/p/w200${contentA?.poster_path}`}
                            alt={contentA?.title || contentA?.name}
                        />
                        <p class="text-black dark:text-white text-xl font-sans font-bold">Rating: {contentA?.vote_average}</p>
                    </div>

                    <div class="flex flex-col p-5 w-200 place-items-center-safe">
                        <h3 class="text-black dark:text-white text-xl font-sans font-bold">Is "{contentB?.title || contentB?.name}" rated</h3>
                        <button class="flex" onClick={() => onGuess("higher")} disabled={buttonsDisabled}>Higher</button>
                        <h3 class="text-black dark:text-white text-xl font-sans font-bold">OR</h3>
                        <button class="flex" onClick={() => onGuess("lower")} disabled={buttonsDisabled}>Lower</button>
                        {message && <p class="text-black dark:text-white text-xl font-sans font-bold">{message}</p>}
                        {gameOver && <button onClick={prepareNewGame}>Play Again</button>}
                    </div>

                    <div class="flex flex-col p-5 place-items-center-safe">
                        <h3 class="text-black dark:text-white text-xl font-sans font-bold">{contentB?.title || contentB?.name}</h3>
                        <img class="h-60 w-120 object-contain"
                            src={`https://image.tmdb.org/t/p/w200${contentB?.poster_path}`}
                            alt={contentB?.title || contentB?.name}
                        />
                        <p class="text-black dark:text-white text-xl font-sans font-bold">{showRatings ? `Rating: ${contentB?.vote_average}` : "Rating: ???"}</p>
                    </div>
                </div>
                </>
            )}
        </div>
            
    );

};
