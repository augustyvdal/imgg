// src/views/HigherLowerView.tsx
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Movie } from "../services/apiClient";
import "../styles/Higherlower.css"

type Props = {
        movieA: Movie | null;
        movieB: Movie | null;
        score: number;
        message: string;
        showRatings: boolean;
        buttonsDisabled: boolean;
        onGuess: (guess: "higher" | "lower") => void;
    };
    
export default function HigherLowerView({movieA, movieB, score, message, showRatings, buttonsDisabled, onGuess}: Props) {

    return (
        <div className="game-container">
            <h1>Higher or Lower: Movie Ratings</h1>
            <h2>Score: {score}</h2>

            <div className="movies">
                <div className="movie">
                    <h3>{movieA?.title}</h3>
                    <img
                        src={`https://image.tmdb.org/t/p/w200${movieA?.poster_path}`}
                        alt={movieA?.title}
                    />
                    <p>Rating: {movieA?.vote_average}</p>
                </div>

                <div className="vs" style={{display: "flex", alignItems: "center", gap: "1rem"}}>
                    <h3>Is "{movieB?.title}" rated</h3>
                    <button onClick={() => onGuess("higher")} disabled={buttonsDisabled}>Higher</button>
                    <h3>OR</h3>
                    <button onClick={() => onGuess("lower")} disabled={buttonsDisabled}>Lower</button>
                    {message && <p>{message}</p>}
                </div>

                <div className="movie">
                    <h3>{movieB?.title}</h3>
                    <img
                        src={`https://image.tmdb.org/t/p/w200${movieB?.poster_path}`}
                        alt={movieB?.title}
                    />
                    <p>{showRatings ? `Rating: ${movieB?.vote_average}` : "Rating: ???"}</p>
                </div>
            </div>
        </div>
    );
};
