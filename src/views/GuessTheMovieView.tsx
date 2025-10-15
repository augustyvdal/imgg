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
        <div className="bg-white dark:bg-gray-900 min-h-screen flex flex-col place-items-center-safe">
            <h1 className="text-black dark:text-white text-2xl flex justify-center font-sans font-bold">Guess the Movie</h1>

            {category === "" && <ChooseCategory onSelect={chooseCategory} />}

            {category !== "" && (
                <>
                    {loading ? (
                        <p className="text-black dark:text-white">Loading new movie...</p>
                    ) : (
                        <>
                            <div className="text-black dark:text-white text-lg  flex flex-col justify-center font-sans">
                                {startingInfo.map((info, i) => (
                                    <p key={i}>{info}</p>
                                ))}
                            </div>

                            <div className="text-black dark:text-white">
                                {clues.map((clue, i) => (
                                    <p key={i}>
                                        <strong>Clue {i + 1}:</strong> {clue}
                                    </p>
                                ))}
                            </div>

                            {message && <p className="text-black dark:text-white">{message}</p>}

                            {!gameOver && (
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        onGuess(guess);
                                        setGuess("");
                                    }}
                                >
                                    <input className="text-black dark:text-white w-full border rounded p-2"
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
                                    <p className="text-black dark:text-white">Final Score: {score}</p>
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