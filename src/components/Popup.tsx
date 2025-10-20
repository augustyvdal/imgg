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
                className="bg-blue-100 dark:bg-col2 text-col1 dark:text-blue-100 rounded-xl p-6 shadow-2xl max-w-lg w-full animate-fadeIn"
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>,
        document.body
    );
}

export function InfoContent({ onClose }: { onClose: () => void }) {
    return (
        <div className="bg-blue-100 dark:bg-col2 text-col1 dark:text-blue-100 rounded-xl p-4 mb-6 text-sm leading-relaxed w-full max-w-lg animate-fadeIn">
            <p className="font-semibold mb-2">How to play:</p>
            <ol className="list-decimal list-inside space-y-1">
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
            </ol>
            <div className="text-center mt-4 ">
                <button
                    className="btn-default"
                    onClick={onClose}
                >
                    Let's Play!
                </button>
            </div>
        </div>
    )
}
