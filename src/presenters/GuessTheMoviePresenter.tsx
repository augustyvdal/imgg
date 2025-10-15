import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { GuessTheMovieModel } from "../models/GuessTheMovieModel";
import GuessTheMovieView from "../views/GuessTheMovieView";

type Props = {
    model: GuessTheMovieModel;
};

export default observer(function GuessTheMoviePresenter({ model }: Props) {
    const [clues, setClues] = useState<string[]>([]);
    const [startingInfo, setStartingInfo] = useState<string[]>([]);
    const [message, setMessage] = useState("");
    const [totalScore, setTotalScore] = useState<number>(0);
    const [gameOver, setGameOver] = useState(false);

    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>("");

    useEffect(() => {
        if (!model.category && selectedCategory === "") return;
        (async () => {
            await startNewRound()
        })();
    }, [selectedCategory]);

    async function startNewRound() {
        setLoading(true);
        await model.startNewRound();
        setStartingInfo(model.startingInfo)
        setClues(model.getCurrentClues());
        setLoading(false);
    }

    async function makeGuess(guess: string) {
        const result = model.makeGuess(guess);
        if (!result) return;

        setTotalScore(result.score);
        setClues(model.getCurrentClues());

        if (result.correct) {
            setMessage(`Correct! The movie was "${model.movie.title}".`);
            setTimeout(async () => {
                setMessage("Next movie loading...");
                await startNewRound();
            }, 1500);

        } else if (result.lose) {
            setMessage(`You lose! The movie was "${model.movie.title}".`);
            setGameOver(true);

        } else {
            setMessage("Wrong guess! Here's another clue...");
        }
    }

    async function chooseCategory(category: "movie" | "tv") {
        setSelectedCategory(category);
        model.chosenCategory(category);
    }

    async function reset() {
        model.restartGame();
        setTotalScore(0);
        setMessage("");
        setGameOver(false);
        setSelectedCategory("");
        setClues([]);
        setStartingInfo([]);
    }

    return (
        <GuessTheMovieView
            loading={loading}
            clues={clues}
            message={message}
            score={totalScore}
            gameOver={gameOver}
            onGuess={makeGuess}
            onRestart={reset}
            category={selectedCategory}
            chooseCategory={chooseCategory}
            startingInfo={startingInfo}
        />
);
});
