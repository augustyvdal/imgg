import { Content } from "../services/apiClient";
import ChooseCategory from "../components/ChooseCategory";
import Spinner from "../components/Spinner";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import {InfoContent, Popup} from "../components/Popup";

type SortGameViewProps = {
    content: Content[];
    onReorder: (fromIndex: number, toIndex: number) => void;
    onSubmit: () => void;
    onReset: () => void;
    feedback: string | null;
    onCategorySelect: (category: string) => void;
    category: string;
    triesLeft: number;
    shake: boolean;
    nextRound: boolean;
    reset: boolean;
    submit: boolean;
    onNextRound: () => void;
    streak: number;
    loading: boolean;
    goToHome: () => void;
};

function SortGameView({ content, onReorder, onSubmit, onReset, feedback, onCategorySelect, category, triesLeft, shake, nextRound, reset, submit, onNextRound, streak, loading, goToHome }: Readonly<SortGameViewProps>) {
    const [showInfo, setShowInfo] = useState(false);
    
    
    return (
        <div className="relative min-h-screen overflow-hidden dark:text-col4 text-col3 font-sans bgcol-4 dark:bg-col3 pt-16 md:pt-20">
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
                Sort Game
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
                <ChooseCategory onSelect={onCategorySelect} />
                <button className="btn--default" onClick={goToHome}>Game Hub</button>
                </motion.div>
            ) : (
                <motion.div
                key="game"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-10 flex flex-col items-center justify-center bg-col4/40 dark:bg-col3/30 backdrop-blur-[3px] rounded-xl mx-auto px-6 py-8 md:px-12 md:py-10 mt-0 max-w-6xl w-[95%] min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)]"
                >
                {loading ? (
                    <Spinner />
                ) : (
                    <div className="w-full flex flex-col items-center justify-center gap-6">
                        <ul className="flex flex-row flex-wrap gap-4 bg-col2/20 dark:bg-col2/30 p-4 rounded-xl shadow-inner justify-center">
                        {content.map((item, index) => (
                            <li
                            key={item.id}
                            className={`bg-col2/30 dark:bg-col2/40 relative w-48 h-72 rounded-lg p-3 flex flex-col items-center overflow-hidden ${shake ? "shake" : ""} ${submit ? "cursor-pointer" : "cursor-not-allowed opacity-70"}`}
                            draggable={submit}
                            onDragStart={(e) => {
                                if (!submit) { e.preventDefault(); return; }
                                e.dataTransfer.setData("fromIndex", index.toString());
                            }}
                            onDragOver={(e) => (submit ? e.preventDefault() : undefined)}
                            onDrop={(e) => {
                                if (!submit) return;
                                const fromIndex = parseInt(e.dataTransfer.getData("fromIndex"));
                                onReorder(fromIndex, index);
                            }}
                            >
                            <div className="absolute top-2 left-2 bg-col1 text-white text-xs cursor-pointer font-bold px-2 py-0.5 rounded-full">
                                #{index + 1}
                            </div>
                            <p className="text-col4 text-center text-sm font-medium mt-6 break-words leading-tight">
                                {item.title || item.name} <span className="text-col4/70 text-xs">({item.year})</span>
                            </p>
                            <img
                                className="h-40 w-80 object-contain"
                                src={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
                                alt=""
                            />
                            </li>
                        ))}
                        </ul>

                        <div className="flex flex-col items-center mt-4 gap-3">
                        {submit ? (
                            <button
                            className="btn--default mt-4"
                            data-cy="submit"
                            onClick={onSubmit}
                            >
                            Submit
                            </button>
                        ) : ""}

                        {nextRound ? (
                            <button
                            className="btn--default"
                            data-cy="next-round"
                            onClick={onNextRound}
                            >
                            Next Round!
                            </button>
                        ) : ""}

                        {reset ? (
                            <button
                            className="btn--default"
                            data-cy="reset"
                            onClick={onReset}
                            >
                            Play Again!
                            </button>
                        ) : ""}

                        {feedback && (
                            <div className="mt-4 w-full max-w-xs bg-col2 text-white font-bold text-center text-lg px-4 py-2 rounded-lg shadow">
                            {feedback}
                            </div>
                        )}

                        <p className="mt-4 w-full max-w-xs bg-col2 text-white font-bold text-center text-lg px-4 py-2 rounded-lg shadow">
                            Win streak: {streak}
                        </p>
                        <button className="btn--default mt-2" onClick={goToHome}>
                            Game Hub
                        </button>
                    </div>
                </div>
            )}
        </motion.div>
    )}
</AnimatePresence>
</div>
);
}

export default SortGameView;
