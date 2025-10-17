import React from "react";
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
    query: string;
    onQueryChange: (q: string) => void;
    searchResults: { id: number; image: string; title: string }[];
    onSelectSuggestion: (title: string) => void;
};

export default function GuessTheMovieView({loading, clues, message, category, score, gameOver, onGuess, onRestart, chooseCategory, startingInfo, query, onQueryChange, searchResults, onSelectSuggestion,}: Props) {
    return (
        <div className="bg-gray-200 dark:bg-gray-900 min-h-screen flex flex-col place-items-center-safe">
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
                                        onGuess(query);
                                        onQueryChange("");
                                    }}
                                    className="guess-form"
                                >
                                    <div className="input-wrapper">
                                        <input
                                            type="text"
                                            value={query}
                                            onChange={(e) => onQueryChange(e.target.value)}
                                            placeholder="Your guess..."
                                            autoComplete="off"
                                        />

                                        {searchResults.length > 0 && (
                                            <ul className="suggestions">
                                                {searchResults.map((s, i) => (
                                                    <li
                                                        key={i}
                                                        onClick={() => onSelectSuggestion(s.title)}
                                                    >
                                                        {s.image ? (
                                                            <img
                                                                src={`https://image.tmdb.org/t/p/w92${s.image}`}
                                                                alt={s.title}
                                                            />
                                                        ) : (
                                                            <div className="placeholder-poster" />
                                                        )}
                                                        <div className="suggestion-text">
                                                            <div>{s.title}</div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>

                                    <button className="bg-violet-600 hover:bg-violet-700 text-white rounded px-4 py-2 disabled:opacity-60 font-bold" type="submit">Guess</button>
                                </form>
                            )}

                            {gameOver && (
                                <div>
                                    <p className="text-black dark:text-white">Final Score: {score}</p>
                                    <button className="bg-violet-600 hover:bg-violet-700 text-white rounded px-4 py-2 disabled:opacity-60 font-bold" onClick={onRestart}>Play Again</button>
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
}