import { useEffect, useState } from "react";
import { MovieModel } from "../models/GuessTheMovieModel";

export function useMovieGamePresenter() {
    const [model] = useState(() => new MovieModel());
    const [clues, setClues] = useState<string[]>([]);
    const [message, setMessage] = useState("");
    const [score, setScore] = useState<number | null>(null);
    const [isOver, setIsOver] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            setLoading(true);
            await model.startNewRound();
            setClues(model.getCurrentClues());
            setLoading(false);
        })();
    }, [model]);

    const makeGuess = (guess: string) => {
        const result = model.makeGuess(guess);
        if (!result) return;

        if (result.correct) {
            setMessage(`Correct! The movie was "${model.movie.title}".`);
            setScore(result.score);
            setIsOver(true);
        } else if (result.lose) {
            setMessage(`You lose! The movie was "${model.movie.title}".`);
            setScore(0);
            setIsOver(true);
        } else {
            setMessage("Wrong guess! Here's another clue...");
            setClues(model.getCurrentClues());
        }
    };

    const reset = async () => {
        setMessage("");
        setScore(null);
        setIsOver(false);
        setLoading(true);
        await model.startNewRound();
        setClues(model.getCurrentClues());
        setLoading(false);
    };

    return { loading, clues, message, score, isOver, makeGuess, reset };
}
