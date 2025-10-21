import React, { useEffect, useRef, useState } from "react";
import { searchTitles } from "../services/apiClient";
import { observer } from "mobx-react-lite";
import GuessTheMovieModel from "../models/GuessTheMovieModel";
import GuessTheMovieView from "../views/GuessTheMovieView";
import { Debounce } from "../utilities/Debounce";
import { submitGameScore } from "../services/guessGameHistoryService";
import { useNavigate } from "react-router-dom";

type GuessTheMovieProps = {
    model: typeof GuessTheMovieModel;
};

export default observer(function GuessTheMoviePresenter({ model }: GuessTheMovieProps) {
    const navigate = useNavigate();
    const [state, setState] = useState(model.createInitialState());
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    const [searchResults, setSearchResults] = useState<{ id: number; image: string; title: string }[]>([]);
    const [query, setQuery] = useState("");
    const debouncedQuery = Debounce(query, 300);

    const didSubmitRef = useRef(false);
    const isStartingFlag = useRef(false);

    useEffect(() => {
        setState(model.createInitialState());
    }, [model]);

    useEffect(() => {
        if (!selectedCategory) return;
    }, [selectedCategory]);

    useEffect(() => {
        (async () => {
            if (!debouncedQuery.trim()) return setSearchResults([]);
            const titles = await searchTitles(debouncedQuery, state.category as "movie" | "tv");
            setSearchResults(titles.slice(0, 5));
        })();
    }, [debouncedQuery, state.category]);

    async function startNewRound() {
        if (isStartingFlag.current) return;
        isStartingFlag.current = true;

        setLoading(true);
        const newState = await model.startNewRound(state);
        setState(newState);
        setLoading(false);

        isStartingFlag.current = false;
    }

    async function makeGuess(guess: string) {
        const { state: newState, correct, lose } = model.makeGuess(state, guess);
        setState(newState);

        if (correct) {
            setMessage(`Correct! The movie was "${newState.title.title}".`);
            await submitIfNeeded(newState);
            setTimeout(() => startNewRound(), 1500);
        } else if (lose) {
            setMessage(`You lose! The movie was "${newState.title.title}".`);
            await submitIfNeeded(newState);
            setGameOver(true);
        } else {
            setMessage("Wrong guess! Here's another clue...");
        }
    }

    async function chooseCategory(category: "movie" | "tv") {
        const updated = model.chosenCategory(state, category);
        setSelectedCategory(category);
        setState(updated);
        didSubmitRef.current = false;
        setLoading(true);
        const started = await model.startNewRound(updated);
        setState(started);
        setLoading(false);
    }

    function reset() {
        const restarted = model.restartGame(state);
        setState(restarted);
        setMessage("");
        setGameOver(false);
        setSelectedCategory("");
        setSearchResults([]);
        setQuery("");
        didSubmitRef.current = false;
    }

    async function submitIfNeeded(currentState: typeof state) {
        if (didSubmitRef.current) return;
        if (currentState.totalScore > 0 && currentState.category) {
            didSubmitRef.current = true;
            try {
                await submitGameScore(currentState.totalScore, currentState.category);
            } catch (e) {
                console.error("Failed to submit score:", e);
            }
        }
    }

    function onQueryChange(value: string) {
        setQuery(value);
    }

    function onSelectSuggestion(title: string) {
        setQuery(title);
        setSearchResults([]);
    }

    const goToHome = () => {
        navigate("/");
    };

    return (
        <GuessTheMovieView
            loading={loading}
            clues={model.getCurrentClues(state)}
            message={message}
            score={state.totalScore}
            gameOver={gameOver}
            onGuess={makeGuess}
            onRestart={reset}
            category={selectedCategory}
            chooseCategory={chooseCategory}
            startingInfo={state.startingInfo}
            query={query}
            onQueryChange={onQueryChange}
            searchResults={searchResults}
            onSelectSuggestion={onSelectSuggestion}
            goToHome={goToHome}
        />
    );
});
