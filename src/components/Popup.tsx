import ReactDOM from "react-dom";
import React from "react";


type Props = {
    onClose: () => void;
    children: React.ReactNode;
};

export function Popup({ onClose, children }: Props) {
    return ReactDOM.createPortal(
        <div
            className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
            onClick={onClose}
        >
            <div
                className="bg-blue-100 dark:bg-$primary_2 text-$primary_1 dark:text-blue-100 rounded-xl p-6 shadow-2xl max-w-lg w-full animate-fadeIn"
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>,
        document.body
    );
}

export const infoText = {
    "/game1": (
    <>
        <li>
            Read the starting clues and make your first guess. After each
            guess, you’ll receive new clues.
        </li>
        <li>
            You have a total of <strong>five tries</strong>. If you guess
            correctly, you’ll earn points equal to{" "}
            <strong>5 minus the number of clues</strong> you used.
        </li>
        <li>
            Try to achieve a high score and compare it on the leaderboard!
        </li>
    </>
    ),
    "/game2": (
    <>
        <li>
            You will receive two movies or TV shows. The rating of the leftmost one is visible, while the rating of the one to the right is hidden.
        </li>
        <li>
            You have a to guess if the TMDB rating of the right movie is higher or lower than the left one.
        </li>
        <li>
            Try to get as many right guesses as possible in a row to get a high score!
        </li>
    </>
    ),
    "/game3": (
    <>
        <li>
            You will receive five movies or TV shows. Your job is to sort them by their TMDB rating.
        </li>
        <li>
            The movie furthest to the <strong>left should have the highest rating</strong> and the movie furthest to the <strong>right should have the lowest rating</strong>.
        </li>
        <li>
            You have a total of <strong>4 tries</strong> to get the correct order.
        </li>
    </>
    ),
};

export function InfoContent({ onClose }: { onClose: () => void }) {
    return (
        <div className="bg-blue-100 dark:bg-$primary_2 text-$primary_1 dark:text-blue-100 rounded-xl p-4 mb-6 text-sm leading-relaxed w-full max-w-lg animate-fadeIn">
            <p className="font-semibold mb-2">How to play:</p>
            <ol className="list-decimal list-inside space-y-1">
                {infoText[window.location.pathname as keyof typeof infoText]}
            </ol>
            <div className="text-center mt-4">
                <button
                    className="text-white hover:underline hover:opacity-80 font-bold text-lg"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    )
}

