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
        <div className="game-container">
            <h1>Higher or Lower</h1>
            {category === "" && <ChooseCategory onSelect={chooseCategory} />}

            {category !== "" && (
                <>
                <h2>Score: {score}</h2>
                
                <div className="items">
                    <div className="item">
                        <h3>{contentA?.title || contentA?.name}</h3>
                        <img
                            src={`https://image.tmdb.org/t/p/w200${contentA?.poster_path}`}
                            alt={contentA?.title || contentA?.name}
                        />
                        <p>Rating: {contentA?.vote_average}</p>
                    </div>

                    <div className="vs">
                        <h3>Is "{contentB?.title || contentB?.name}" rated</h3>
                        <button onClick={() => onGuess("higher")} disabled={buttonsDisabled}>Higher</button>
                        <h3>OR</h3>
                        <button onClick={() => onGuess("lower")} disabled={buttonsDisabled}>Lower</button>
                        {message && <p>{message}</p>}
                        {gameOver && <button onClick={prepareNewGame}>Play Again</button>}
                    </div>

                    <div className="item">
                        <h3>{contentB?.title || contentB?.name}</h3>
                        <img
                            src={`https://image.tmdb.org/t/p/w200${contentB?.poster_path}`}
                            alt={contentB?.title || contentB?.name}
                        />
                        <p>{showRatings ? `Rating: ${contentB?.vote_average}` : "Rating: ???"}</p>
                    </div>
                </div>
                </>
            )}
        </div>
            
    );

};
