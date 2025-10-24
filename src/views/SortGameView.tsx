import { Content } from "../services/apiClient";
import ChooseCategory from "../components/ChooseCategory";
import Spinner from "../components/Spinner";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { InfoContent, Popup } from "../components/Popup";
import {DndContext, closestCenter, PointerSensor, useSensor, useSensors} from "@dnd-kit/core";
import { SortableContext, useSortable, rectSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
};

function CategoryMenu({ onCategorySelect }: any) {
    const [showInfo, setShowInfo] = useState(false);

    return (
        <>
            {showInfo && (
                <Popup onClose={() => setShowInfo(false)}>
                    <InfoContent onClose={() => setShowInfo(false)} />
                </Popup>
            )}

            <motion.div
                key="menu"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-10 flex flex-col items-center justify-center px-6 pt-12"
            >
                <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight drop-shadow-lg mb-6 text-center">
                    Sort Game
                </h1>

                <button
                    onClick={() => setShowInfo(true)}
                    className="mt-10 flex items-center gap-2 px-5 py-2 bg-white/10 hover:bg-white/20 rounded-full dark:text-col4 text-col3 transition cursor-pointer"
                    title="How to play"
                >
                    <FontAwesomeIcon icon={faInfoCircle} />
                    <span className="font-medium">How to Play</span>
                </button>

                <ChooseCategory onSelect={onCategorySelect} />
            </motion.div>
        </>
    );
}

function GameItems({ id, item, index, submit, shake }: any) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: isDragging ? "none" : transition || "transform 200ms ease-in-out",
        zIndex: isDragging ? 999 : 0,
        opacity: isDragging ? 0.9 : 1,
    };

    return (
        <li
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...(submit ? listeners : {})}
            className={`bg-col2/30 dark:bg-col2/40 relative w-48 h-72 rounded-lg p-3 flex flex-col items-center overflow-hidden shadow-md
                  transition-all duration-300 ease-out
                  ${shake ? "shake" : ""}
                  ${submit ? "cursor-grab hover:scale-[1.02]" : "cursor-not-allowed opacity-70"}
                  ${isDragging ? "scale-105 ring-2 ring-col1/80 shadow-xl" : ""}
      `}
        >
            <div className="absolute top-2 left-2 bg-col1 text-white text-xs cursor-pointer font-bold px-2 py-0.5 rounded-full">
                #{index + 1}
            </div>
            <p className="text-col4 text-center text-sm font-medium mt-6 break-words leading-tight">
                {item.title || item.name}{" "}
                <span className="text-col4/70 text-xs">({item.year})</span>
            </p>
            {item.poster_path && (
                <img
                    src={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
                    alt={item.label}
                    className="object-contain w-80 h-40 pointer-events-none"
                />
            )}
            <p className="mt-3 text-center text-white font-semibold">{item.label}</p>
        </li>
    );
}

function SortingGame({ content, submit, shake, onReorder }: any) {
    const sensors = useSensors(useSensor(PointerSensor));

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={({ active, over }) => {
                if (!over || active.id === over.id) return;
                const fromIndex = content.findIndex((i: any) => i.id === active.id);
                const toIndex = content.findIndex((i: any) => i.id === over.id);
                onReorder(fromIndex, toIndex);
            }}
        >
            <SortableContext items={content.map((i: any) => i.id)} strategy={rectSortingStrategy}>
                <motion.ul
                    layout
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="flex flex-row flex-wrap gap-4 bg-col2/20 dark:bg-col2/30 p-4 rounded-xl shadow-inner justify-center"
                >
                    {content.map((item: any, index: number) => (
                        <GameItems
                            key={item.id}
                            id={item.id}
                            item={item}
                            index={index}
                            submit={submit}
                            shake={shake}
                        />
                    ))}
                </motion.ul>
            </SortableContext>
        </DndContext>
    );
}


function GameActions({submit, nextRound, reset, feedback, streak, onSubmit, onNextRound, onReset}: any) {
    return (
        <div className="flex flex-col items-center mt-4 gap-3">
            {submit && (
                <button className="btn--default mt-4" data-cy="submit" onClick={onSubmit}>
                    Submit
                </button>
            )}

            {nextRound && (
                <button className="btn--default" data-cy="next-round" onClick={onNextRound}>
                    Next Round!
                </button>
            )}

            {reset && (
                <button className="btn--default" data-cy="reset" onClick={onReset}>
                    Play Again!
                </button>
            )}

            {feedback && (
                <div className="mt-4 w-full max-w-xs bg-col2 text-white font-bold text-center text-lg px-4 py-2 rounded-lg shadow">
                    {feedback}
                </div>
            )}

            <p className="mt-4 w-full max-w-xs bg-col2 text-white font-bold text-center text-lg px-4 py-2 rounded-lg shadow">
                Win streak: {streak}
            </p>
        </div>
    );
}

export function SortGameView({content, onReorder, onSubmit, onReset, feedback, onCategorySelect, category, shake, nextRound, reset, submit, onNextRound, streak, loading}: Readonly<SortGameViewProps>) {
    return (
        <div className="relative min-h-screen overflow-hidden dark:text-col4 text-col3 font-sans bgcol-4 dark:bg-col3 pt-16 md:pt-20">
            <div className="absolute inset-0">
                <img
                    src="/assets/images/img.jpg"
                    alt="background"
                    className="w-full h-full object-cover opacity-10"
                />
            </div>
            <AnimatePresence mode="wait">
                {category === "" ? (
                    <CategoryMenu onCategorySelect={onCategorySelect} />
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
                            <>
                                <SortingGame content={content} submit={submit} shake={shake} onReorder={onReorder} />
                                <GameActions
                                    submit={submit}
                                    nextRound={nextRound}
                                    reset={reset}
                                    feedback={feedback}
                                    streak={streak}
                                    onSubmit={onSubmit}
                                    onNextRound={onNextRound}
                                    onReset={onReset}
                                />
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default SortGameView;
