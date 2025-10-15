import React, { useState } from "react";
import "../styles/Guessthemovie.css";
import ChooseCategory from "../components/ChooseCategory";

type Props = {
    loading: boolean;
    clues: string[];
    message: string;
    category: string;
    score: number;
    gameOver: boolean;
    onGuess: (guess: string) => void;
    onRestart: () => void;
    chooseCategory: (category: "movie" | "tv") => void;
    startingInfo: string[];
};

export default function GuessTheMovieView({loading, clues, message, category, score, gameOver, onGuess, onRestart, chooseCategory, startingInfo}: Props) {
    const [guess, setGuess] = useState("");


    return (
        <div className="guess-container">
            <h1>Guess the Movie</h1>

            {category === "" && <ChooseCategory onSelect={chooseCategory} />}

            {category !== "" && (
                <>
                    {loading ? (
                        <p>Loading new movie...</p>
                    ) : (
                        <>
                            <div className="starting-info">
                                {startingInfo.map((info, i) => (
                                    <p key={i}>{info}</p>
                                ))}
                            </div>

                            <div className="clues">
                                {clues.map((clue, i) => (
                                    <p key={i}>
                                        <strong>Clue {i + 1}:</strong> {clue}
                                    </p>
                                ))}
                            </div>

                            {message && <p className="message">{message}</p>}

                            {!gameOver && (
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

                            {gameOver && (
                                <div>
                                    <p>Final Score: {score}</p>
                                    <button onClick={onRestart}>Play Again</button>
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
}