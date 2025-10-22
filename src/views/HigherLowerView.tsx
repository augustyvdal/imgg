// src/views/HigherLowerView.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Content } from "../services/apiClient";
import ChooseCategory from "../components/ChooseCategory";
import Spinner from "../components/Spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { InfoContent, Popup } from "../components/Popup";

type Props = {
    contentA: Content | null;
    contentB: Content | null;
    score: number;
    category: string;
    message: string;
    showRatings: boolean;
    buttonsDisabled: boolean;
    gameOver: boolean;
    loading: boolean;
    chooseCategory: (category: "movie" | "tv") => void;
    onGuess: (guess: "higher" | "lower") => void;
    prepareNewGame: () => void;
    goToHome: () => void;
};

export default function HigherLowerView({
    contentA,
    contentB,
    score,
    category,
    message,
    showRatings,
    buttonsDisabled,
    gameOver,
    loading,
    chooseCategory,
    onGuess,
    prepareNewGame,
    goToHome,
}: Props) {
    const [showInfo, setShowInfo] = useState(false);

    return (
        <div className="relative min-h-screen overflow-hidden dark:text-col4 text-col3 font-sans bg-col4/40 dark:bg-col3 pt-16 md:pt-20">
            <div className="absolute inset-0">
            <img
                src="/assets/images/img.jpg"
                alt="background"
                className="w-full h-full object-cover opacity-10"
            />
            </div>
            {category === "" && (
            <div className="relative z-10 flex flex-col items-center justify-center px-6 pt-12">
                <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight drop-shadow-lg mb-6 text-center">
                Higher or Lower?
                </h1>

                <button
                onClick={() => setShowInfo(true)}
                className="mt-10 flex items-center gap-2 px-5 py-2 bg-white/10 hover:bg-white/20 rounded-full dark:text-[var(--color-col4)] text-[var(--color-col3)] transition cursor-pointer"
                title="How to play"
                >
                <FontAwesomeIcon icon={faInfoCircle} />
                <span className="font-medium">How to Play</span>
                </button>
            </div>
            )}
            {showInfo && (
                <Popup onClose={() => setShowInfo(false)}>
                    <InfoContent onClose={() => setShowInfo(false)} />
                </Popup>
            )}
            
            <AnimatePresence mode="wait">
            {category === "" ? (
                <motion.div
                key="menu"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-10 flex flex-col items-center justify-center"
                >
                <ChooseCategory onSelect={chooseCategory} />
                <button className="btn--default" onClick={goToHome}>
                    Game Hub
                </button>
                </motion.div>
            ) : (
                <motion.div 
                key="game"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-10 flex flex-col items-center bg-col4/30 dark:bg-col3/30 backdrop-blur-[3px] rounded-xl mx-auto px-6 py-8 md:px-12 md:py-10 mt-0 max-w-6xl w-[95%] min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)]"
                >
                {loading ? (
                    <Spinner />
                ) : (
                    <div className="w-full flex flex-col items-center gap-6">
                    <h2 className="mt-1 w-full max-w-xs bg-col2 text-col4 font-bold text-center text-lg px-4 py-2 rounded-lg shadow">
                        Current Score: {score}
                    </h2>
                    <div className="w-full flex flex-row justify-center gap-6">
                        <div className="flex flex-col items-center gap-2">
                        <h3 className="text-col3 dark:text-col4 text-xl font-bold text-center h-16 flex items-center justify-center px-2">
                            {contentA?.title || contentA?.name}
                        </h3>
                        <img
                            className="h-[350px] w-auto object-contain mb-2"
                            src={`https://image.tmdb.org/t/p/w200${contentA?.poster_path}`}
                            alt={contentA?.title || contentA?.name || ""}
                        />
                        <p className="text-col3 dark:text-col4 text-lg font-semibold text-center h-16 flex items-center justify-center">
                            Rating: {contentA?.vote_average}
                        </p>
                        </div>

                        <p className="text-col3 dark:text-col4 text-3xl font-extrabold self-center">VS</p>

                        <div className="flex flex-col items-center gap-2">
                        <h3 className="text-col3 dark:text-col4 text-xl font-bold text-center h-16 flex items-center justify-center px-2">
                            {contentB?.title || contentB?.name}
                        </h3>
                        <img
                            className="h-[350px] w-auto object-contain mb-2"
                            src={`https://image.tmdb.org/t/p/w200${contentB?.poster_path}`}
                            alt={contentB?.title || contentB?.name || ""}
                        />
                        <p className="text-col3 dark:text-col4 text-lg font-semibold text-center h-16 flex items-center justify-center">
                            {showRatings ? `Rating: ${contentB?.vote_average}` : "Rating: ???"}
                        </p>

                        <div className="flex gap-3">
                            <button
                            className="btn--default"
                            onClick={() => onGuess("higher")}
                            disabled={buttonsDisabled}
                            >
                            Higher
                            </button>
                            <button
                            className="btn--default"
                            onClick={() => onGuess("lower")}
                            disabled={buttonsDisabled}
                            >
                            Lower
                            </button>
                        </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-3 mt-2">
                        {message && (
                        <p className="text-col4 text-2xl font-bold text-center">{message}</p>
                        )}
                        {gameOver && (
                        <button className="btn--default" onClick={prepareNewGame}>
                            Play Again!
                        </button>
                        )}
                    </div>
                    </div>
                )}
                </motion.div>
            )}
            </AnimatePresence>
        </div>
    );
}