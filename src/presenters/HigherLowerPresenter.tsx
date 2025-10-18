import React, { useEffect, useState, useRef } from "react";
import { observer } from "mobx-react-lite";
import HigherLowerView from "../views/HigherLowerView";
import { HigherLowerModel } from "../models/HigherLowerModel";
import { submitScore } from "../services/leaderboardService";
import { set } from "mobx";

type Props = {
  model: HigherLowerModel;
};

export default observer(function HigherLowerPresenter({ model }: Props) {
    // Success or fail message after guess
    const [message, setMessage] = useState<string>("");
    // Boolean to show rating for content B after guess
    const [showRatings, setShowRatings] = useState(false);
    // Boolean to disable buttons
    const [buttonsDisabled, setButtonsDisabled] = useState(false);
    // Boolean to check if content is fetched
    const [loading, setLoading] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>("");


    const didSubmitRef = useRef(false); // Ref to track if score has been submitted

    // Resets the game everytime it renders. So if user goes back to menu and returns, game is reset.
    useEffect(() => {
        model.reset();
    }, [model]);

    const submitIfNeeded = async () => {
        if (didSubmitRef.current) return;
        if (model.score > 0 && model.category) {
            didSubmitRef.current = true;
            try {
                await submitScore(model.score, model.category);
            } catch (e) {
                console.error("Failed to submit score:", e);
            }
        }
    };

    const onGuess = (guess: "higher" | "lower") => {
        if (buttonsDisabled) return;

        const correct = model.makeGuess(guess);
        setShowRatings(true);
        setButtonsDisabled(true);

        if (correct) {
        setMessage("Correct!");
        // Wait 1.5s, then advance
        setTimeout(() => {
            model.nextItem();
            setShowRatings(false);
            setButtonsDisabled(false);
            setMessage("");
        }, 1500);
        } else {
        setMessage("Wrong! Game Over.");
        setGameOver(true);
        submitIfNeeded();
        }
    };

    // Takes in the chosen category.
    // A new game is started only after a category is chosen
    const chooseCategory = async (category: "movie" | "tv") => {
        model.chosenCategory(category);
        setSelectedCategory(category);
        didSubmitRef.current = false;
        setLoading(true);
        await model.startNewGame();
        setLoading(false);
    };

    const prepareNewGame = () => {
        model.reset();                       
        setShowRatings(false);
        setButtonsDisabled(false);
        setSelectedCategory("");
        setMessage("");
        setGameOver(false);

        didSubmitRef.current = false;
    };

    return (
        <HigherLowerView
        contentA = {model.contentA}
        contentB = {model.contentB}
        score = {model.score}
        category = {selectedCategory}
        message = {message}
        showRatings = {showRatings}
        buttonsDisabled = {buttonsDisabled}
        gameOver = {gameOver}
        loading = {loading}
        chooseCategory={chooseCategory}
        onGuess={onGuess}
        prepareNewGame={prepareNewGame}
        />
    );
});

