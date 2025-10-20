import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import ChooseCategory from "../components/ChooseCategory";
import Spinner from "../components/Spinner";
import {Popup, InfoContent} from "../components/Popup";

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

export default function GuessTheMovieView({
                                              loading,
                                              clues,
                                              message,
                                              category,
                                              score,
                                              gameOver,
                                              onGuess,
                                              onRestart,
                                              chooseCategory,
                                              startingInfo,
                                              query,
                                              onQueryChange,
                                              searchResults,
                                              onSelectSuggestion,
                                          }: Props) {
    const [showInfo, setShowInfo] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const handleSelectSuggestion = (title: string) => {
        onSelectSuggestion(title);
        setShowSuggestions(false);
    };

    return (
        <div className="page-background">
            <div className="flex items-center gap-2 mb-6">
                <h1 className="text-3xl font-bold text-black dark:text-white">
                    Guess the {category === "tv" ? "TV Show" : "Movie"}
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
                        <div className="w-full max-w-lg">
                            <div className="text-black dark:text-white space-y-1 mb-4 text-center">
                                {startingInfo.map((info, i) => (
                                    <p key={i}>{info}</p>
                                ))}
                            </div>

                            <div className="text-black dark:text-white space-y-1 mb-4 text-center">
                                {clues.map((clue, i) => (
                                    <p key={i}>
                                        <strong>Clue {i + 1}:</strong> {clue}
                                    </p>
                                ))}
                            </div>

                            {message && (
                                <p className="text-black dark:text-white font-medium mb-4 text-center">
                                    {message}
                                </p>
                            )}

                            {!gameOver && (
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        if (query.trim() !== "") {
                                            onGuess(query);
                                            onQueryChange("");
                                        }
                                    }}
                                    className="flex flex-col items-center gap-3"
                                >
                                    <div className="relative w-full max-w-md">
                                        <input
                                            type="text"
                                            value={query}
                                            onChange={(e) => {
                                                onQueryChange(e.target.value);
                                                setShowSuggestions(e.target.value.trim() !== "");
                                            }}
                                            placeholder="Your guess..."
                                            autoComplete="off"
                                            onFocus={() =>
                                                setShowSuggestions(query.trim() !== "")
                                            }
                                            className="w-full border border-gray-300 rounded-md py-2 px-3 text-black dark:text-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-col1"
                                        />

                                        {showSuggestions && searchResults.length > 0 && (
                                            <ul className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border border-gray-300 rounded-md mt-1 shadow-lg max-h-56 overflow-y-auto z-50">
                                                {searchResults.map((s, i) => (
                                                    <li
                                                        key={i}
                                                        onClick={() =>
                                                            handleSelectSuggestion(s.title)
                                                        }
                                                        className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                    >
                                                        {s.image ? (
                                                            <img
                                                                src={`https://image.tmdb.org/t/p/w92${s.image}`}
                                                                alt={s.title}
                                                                className="w-[60px] h-[80px] object-cover rounded-md"
                                                            />
                                                        ) : (
                                                            <div className="w-[60px] h-[80px] bg-gray-300 dark:bg-gray-700 rounded-md" />
                                                        )}
                                                        <div className="flex flex-col">
                                                            <span className="font-medium text-black dark:text-white">
                                                                {s.title}
                                                            </span>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>

                                    <div className="flex justify-center gap-4">
                                        <button
                                            type="submit"
                                            disabled={query.trim() === ""}
                                            className={`px-5 py-2 rounded-md font-semibold text-white transition-colors ${
                                                query.trim() === ""
                                                    ? "bg-col1 cursor-not-allowed opacity-70"
                                                    : "bg-col1 hover:opacity-70 cursor-pointer"
                                            }`}
                                        >
                                            Guess
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onGuess("")}
                                            className="px-5 py-2 rounded-md font-semibold text-white cursor-pointer bg-gray-600 hover:bg-gray-700 transition-colors"
                                        >
                                            Skip
                                        </button>
                                    </div>
                                </form>
                            )}

                            {gameOver && (
                                <div className="text-center mt-6 flex flex-col items-center-safe gap-y-3">
                                    <p className="mt-4 w-full max-w-xs bg-col2 text-white font-bold text-center text-lg px-4 py-2 rounded-lg shadow">
                                        Final Score: <strong>{score}</strong>
                                    </p>
                                    <button
                                        className="bg-col1 hover:opacity-70 text-white rounded px-5 py-2 font-bold transition-colors cursor-pointer"
                                        onClick={onRestart}
                                    >
                                        Play Again!
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}