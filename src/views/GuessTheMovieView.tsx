import React, { useState } from "react";
import "../styles/Guessthemovie.css";

type Props = {
    loading: boolean;
    clues: string[];
    message: string;
    score: number | null;
    isOver: boolean;
    onGuess: (guess: string) => void;
    onRestart: () => void;
};

export default function GuessTheMovieView({loading, clues, message, score,isOver,onGuess, onRestart,}: Props) {
    const [guess, setGuess] = useState("");

    if (loading) return <p>Loading random movie...</p>;

    return (
        <div className="guess-container">
            <h1>Guess the Movie</h1>

            <div className="clues">
                {clues.map((clue, i) => (
                    <p key={i}>
                        <strong>Clue {i + 1}:</strong> {clue}
                    </p>
                ))}
            </div>

            {message && <p className="message">{message}</p>}

            {!isOver && (
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        onGuess(guess);
                        setGuess("");
                    }}
                >
                    <input
                        type="text"
                        value={guess}
                        onChange={(e) => setGuess(e.target.value)}
                        placeholder="Your guess..."
                    />
                    <button type="submit">Guess</button>
                </form>
            )}

            {isOver && (
                <div>
                    <p>Final Score: {score}</p>
                    <button onClick={onRestart}>Play Again</button>
                </div>
            )}
        </div>
    );
}
