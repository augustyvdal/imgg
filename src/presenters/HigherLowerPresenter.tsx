import React, { useEffect, useState, useRef } from "react";
import { observer } from "mobx-react-lite";
import HigherLowerView from "../views/HigherLowerView";
import HigherLowerModel from "../models/HigherLowerModel";
import { submitScore } from "../services/leaderboardService";
import { set } from "mobx";

type HigherLowerPresenterProps = {
    model: typeof HigherLowerModel;
};

export default observer(function HigherLowerPresenter({ model }: HigherLowerPresenterProps) {
    const [state, setState] = useState(model.createInitialState());
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
        setState(model.createInitialState());
    }, [model]);

    const submitIfNeeded = async () => {
        if (didSubmitRef.current) return;
        if (state.score > 0 && state.category) {
            didSubmitRef.current = true;
            try {
                await submitScore(state.score, state.category);
            } catch (e) {
                console.error("Failed to submit score:", e);
            }
        }
    };

    const onGuess = (guess: "higher" | "lower") => {
        if (buttonsDisabled) return;

        const { state: newState, correct } = model.makeGuess(state, guess);
        setShowRatings(true);
        setButtonsDisabled(true);

        if (correct) {
        setMessage("Correct!");
        // Wait 1.5s, then advance
        setTimeout(() => {
            const next = model.nextItem(newState);
            setState(next);
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
        const updated = model.chosenCategory(state, category);
        setSelectedCategory(category);
        didSubmitRef.current = false;
        setLoading(true);
        const started = await model.startNewGame(updated);
        setState(started);
        setLoading(false);
    };

    const prepareNewGame = () => {                      
        setState(model.createInitialState());
        setShowRatings(false);
        setButtonsDisabled(false);
        setSelectedCategory("");
        setMessage("");
        setGameOver(false);
        didSubmitRef.current = false;
    };

    return (
        <HigherLowerView
        contentA = {state.contentA}
        contentB = {state.contentB}
        score = {state.score}
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

