import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { GuessTheMovieModel } from "../models/GuessTheMovieModel";
import GuessTheMovieView from "../views/GuessTheMovieView";

type Props = {
    model: GuessTheMovieModel;
};

export default observer(function GuessTheMoviePresenter({ model }: Props) {
    const [clues, setClues] = useState<string[]>([]);
    const [message, setMessage] = useState("");
    const [score, setScore] = useState<number | null>(null);
    const [isOver, setIsOver] = useState(false);
    const [loading, setLoading] = useState(true);

    // Load a new round on mount
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

    return (
        <GuessTheMovieView
            loading={loading}
            clues={clues}
            message={message}
            score={score}
            isOver={isOver}
            onGuess={makeGuess}
            onRestart={reset}
        />
);
});
