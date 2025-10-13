import React, { useState } from "react";
import "../styles/Guessthemovie.css";
import ChooseCategory from "../components/ChooseCategory";

type Props = {
    loading: boolean;
    clues: string[];
    message: string;
    category: string;
    score: number | null;
    isOver: boolean;
    onGuess: (guess: string) => void;
    onRestart: () => void;
    chooseCategory: (category: "movie" | "tv") => void;
};

export default function GuessTheMovieView({loading, clues, message, category, score, isOver, onGuess, onRestart, chooseCategory,}: Props) {
    const [guess, setGuess] = useState("");


    return (
        <div className="guess-container">
            <h1>Guess the Movie</h1>
            {category === "" && <ChooseCategory onSelect={chooseCategory} />}

            {category !== "" && (
                <>
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
                </>
            )}
        </div>
    );
}
