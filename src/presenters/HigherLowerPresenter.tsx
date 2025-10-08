// src/presenters/HigherLowerPresenter.ts
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import HigherLowerView from "../views/HigherLowerView";
import { HigherLowerModel } from "../models/higherLowerModel";


type Props = {
  model: HigherLowerModel;
};

export default observer(function HigherLowerPresenter({ model }: Props) {
    // Success or fail message after guess
    const [message, setMessage] = useState<string>("");
    // Boolean to show rating for movie B after guess
    const [showRatings, setShowRatings] = useState(false);
    // Boolean to disable buttons
    const [buttonsDisabled, setButtonsDisabled] = useState(false);
    // Boolean to check if movies are fetched
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        model.fetchMovies().then(() => setIsLoaded(true));
    }, [model]);

    const onGuess = (guess: "higher" | "lower") => {
        if (buttonsDisabled) return;

        const correct = model.makeGuess(guess);
        setShowRatings(true);
        setButtonsDisabled(true);

        if (correct) {
        setMessage("Correct!");
        // Wait 1.5s, then advance
        setTimeout(() => {
            model.nextRound();
            setShowRatings(false);
            setButtonsDisabled(false);
            setMessage("");
        }, 1500);
        } else {
        setMessage("Wrong! Game Over.");
        }
    };

    return (
        <HigherLowerView
        movieA = {model.movieA}
        movieB = {model.movieB}
        score = {model.score}
        message = {message}
        showRatings = {showRatings}
        buttonsDisabled = {buttonsDisabled}
        onGuess={onGuess}
        />
    );
});

