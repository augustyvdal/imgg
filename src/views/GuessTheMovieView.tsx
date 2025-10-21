import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import ChooseCategory from "../components/ChooseCategory";
import Spinner from "../components/Spinner";
import { Popup, InfoContent } from "../components/Popup";

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
    goToHome: () => void;
    finalScore: number;
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
                                              goToHome,
                                              finalScore,
                                          }: Props) {
    const [showInfo, setShowInfo] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [previousGuesses, setPreviousGuesses] = useState<string[]>([]);

    const handleSelectSuggestion = (title: string) => {
        onSelectSuggestion(title);
        setShowSuggestions(false);
    };

    const handleGuess = (guess: string) => {
        if (guess.trim() === "") return;
        onGuess(guess);
        setPreviousGuesses((prev) => [guess, ...prev.slice(0, 4)]);
        onQueryChange("");
    };

    return (
        <div className="relative min-h-screen overflow-hidden dark:text-col4 text-col3 font-sans bg-col3">
            <div className="absolute inset-0">
                <img
                    src="/img.jpg"
                    alt="background"
                    className="w-full h-full object-cover opacity-10"
                />
            </div>

            {showInfo && (
                <Popup onClose={() => setShowInfo(false)}>
                    <InfoContent onClose={() => setShowInfo(false)} />
                </Popup>
            )}

            <AnimatePresence mode="wait">
                {category === "" ? (
                    <motion.div
                        key="choose"
                        initial={{ opacity: 0, }}
                        animate={{ opacity: 1, }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.6 }}
                        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6"
                    >
                        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight drop-shadow-lg mb-6 text-center">
                            Guess the Movie
                        </h1>

                        {/* Unsure about this
                        <p className="text--subheader mb-10 text-center">
                            Subheader placeholder
                        </p>
                        */}

                        <motion.button
                            onClick={() => setShowInfo(true)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95}}
                            transition={{duration: 0}}
                            className="mt-10 flex items-center gap-2 px-5 py-2 bg-white/10 hover:bg-white/20 rounded-full dark:text-[var(--color-col4)] text-[var(--color-col3)] transition cursor-pointer"
                        >
                            <FontAwesomeIcon icon={faCircleInfo} />
                            <span className="font-medium">How to Play</span>
                        </motion.button>

                        <ChooseCategory onSelect={chooseCategory} />

                        <motion.button
                            onClick={goToHome}
                            className="btn--default"
                        >
                            Main Menu
                        </motion.button>
                    </motion.div>
                ) : (

                    <motion.div
                        key="game"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="relative z-10 flex flex-col md:flex-row min-h-screen bg-col3/30 backdrop-blur-[3px]"
                    >
                        {/* Clues & Info */}
                        <div
                            className="flex-1 p-8 md:p-20 flex flex-col justify-center"
                        >
                            <div className="flex items-center gap-3 mb-8">
                                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                                    {category === "tv" ? "TV Show" : "Movie"} Clues
                                </h1>
                            </div>

                            {loading ? (
                                <Spinner />
                            ) : (
                                <>
                                    <div className=" rounded-xs p-6 bg-col1/0 space-y-5 w-[max:100%]">
                                        {/* Starting Info */}
                                        {startingInfo.length > 0 && (
                                            <div className="space-y-3 text-col4">
                                                {startingInfo.map((info, i) => (
                                                    <motion.p
                                                        key={i}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ duration: 0.4, delay: i * 0.1 }}
                                                        className="leading-relaxed"
                                                    >
                                                        {info}
                                                    </motion.p>
                                                ))}
                                            </div>
                                        )}

                                        {/* Divider */}
                                        <motion.div
                                            className="border-t border-white/10 my-3 origin-left"
                                        />

                                        {/* Clues */}
                                        <div className="space-y-4">
                                            {clues.map((clue, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.4, delay: i * 0.1 }}
                                                >
                                                    <h3 className="text-lg font-semibold text-col4">Clue {i + 1}</h3>
                                                    <p className="text-col4 mt-1 leading-relaxed">{clue}</p>
                                                </motion.div>
                                            ))}

                                            {/* Locked Clues */}
                                            {clues.length < 4 &&
                                                Array.from({ length: 4 - clues.length }).map((_, j) => (
                                                    <motion.div
                                                        key={`locked-${j}`}
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 0.5 }}
                                                        transition={{ duration: 0.3 }}
                                                    >
                                                        <h3 className="text-lg font-semibold text-gray-500">
                                                            Clue {clues.length + j + 1}
                                                        </h3>
                                                        <p className="text-gray-600 mt-1 italic">Locked</p>
                                                    </motion.div>
                                                ))}
                                        </div>
                                    </div>

                                    {message && (
                                        <p className="text-lg font-medium text-col1 mb-4">
                                            {message}
                                        </p>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Input, Buttons, Score */}
                        <div
                            className="flex-1 p-8 md:p-12  flex flex-col justify-center"
                        >
                            {!gameOver ? (
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleGuess(query);
                                    }}
                                    className="flex flex-col gap-6 w-full max-w-md mx-auto"
                                >
                                    {/* Previous Guesses (Not done yet)
                                    {previousGuesses.length > 0 && (
                                        <div className="mt-6">
                                            <h3 className="text-xl font-semibold mb-2 text-center">
                                                Previous Guesses
                                            </h3>
                                            <ul className="text-gray-300 space-y-1 text-center">
                                                {previousGuesses.map((guess, i) => (
                                                    <li key={i} className="text-sm">
                                                        {guess}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    */}

                                    <div className="text-center mb-2">
                                        <p className="text-lg text-gray-300">
                                            Current Score:{" "}
                                            <span className="font-bold text-white">{score}</span>
                                        </p>
                                    </div>

                                    {/* Input */}
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={query}
                                            onChange={(e) => {
                                                onQueryChange(e.target.value);
                                                setShowSuggestions(e.target.value.trim() !== "");
                                            }}
                                            placeholder="Type your guess..."
                                            autoComplete="off"
                                            onFocus={() => setShowSuggestions(query.trim() !== "")}
                                            className="w-full border border-gray-500 bg-col1/50 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-col1"
                                        />

                                        {showSuggestions && searchResults.length > 0 && (
                                            <ul className="absolute top-full left-0 right-0 bg-col2/90 border border-gray-600 rounded-lg mt-1 shadow-lg max-h-56 overflow-y-auto z-50">
                                                {searchResults.map((s, i) => (
                                                    <li
                                                        key={i}
                                                        onClick={() => handleSelectSuggestion(s.title)}
                                                        className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-800 transition-colors"
                                                    >
                                                        {s.image ? (
                                                            <img
                                                                src={`https://image.tmdb.org/t/p/w92${s.image}`}
                                                                alt={s.title}
                                                                className="w-[50px] h-[70px] object-cover rounded-md"
                                                            />
                                                        ) : (
                                                            <div className="w-[50px] h-[70px] bg-gray-700 rounded-md" />
                                                        )}
                                                        <div className="flex flex-col">
                                                          <span className="font-medium text-white">
                                                            {s.title}
                                                          </span>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                        <motion.button
                                            type="submit"
                                            disabled={query.trim() === ""}
                                            className={`flex-1 py-3 btn--default text-lg transition-all ${
                                                query.trim() === ""
                                                    ? "bg-col1/50 cursor-not-allowed"
                                                    : "bg-col1 hover:opacity-80 cursor-pointer"
                                            }`}
                                        >
                                            Submit Guess
                                        </motion.button>

                                        <motion.button
                                            type="button"
                                            onClick={() => onGuess("")}
                                            className="flex-1 py-3 rounded-l font-semibold text-white text-lg bg-gray-700 hover:bg-gray-600 transition-all cursor-pointer"
                                        >
                                            Skip
                                        </motion.button>
                                    </div>
                                </form>
                            ) : (
                                <motion.div
                                    className="flex flex-col items-center justify-center text-center w-full h-full"
                                >
                                    <p className="mt-4 w-full max-w-xs bg-col2 text-white font-bold text-center text-lg px-4 py-2 rounded-lg shadow">
                                        Final Score: <strong>{finalScore}</strong>
                                    </p>
                                    <button
                                        onClick={onRestart}
                                        className="mt-4 btn--default text-lg"
                                    >
                                        Play Again!
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
