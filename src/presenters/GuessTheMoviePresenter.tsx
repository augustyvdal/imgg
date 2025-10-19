import React, { useEffect, useRef, useState } from "react";
import { searchTitles } from "../services/apiClient";
import { observer } from "mobx-react-lite";
import { GuessTheMovieModel } from "../models/GuessTheMovieModel";
import GuessTheMovieView from "../views/GuessTheMovieView"
import { Debounce } from "../utilities/Debounce";
import { submitGameScore } from "../services/guessGameHistoryService";

type Props = {
    model: GuessTheMovieModel;
};

export default observer(function GuessTheMoviePresenter({ model }: Props) {
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>("");

    const [clues, setClues] = useState<string[]>([]);
    const [startingInfo, setStartingInfo] = useState<string[]>([]);
    const [message, setMessage] = useState("");
    const [totalScore, setTotalScore] = useState<number>(0);
    const [gameOver, setGameOver] = useState(false);

    const [searchResults, setSearchResults] = useState<{ id: number; image: string; title: string;  }[]>([]);
    const [query, setQuery] = useState("");
    const debouncedQuery = Debounce(query, 300);
    const isStartingFlag = useRef(false);


    const didSubmitRef = useRef(false);

    useEffect(() => {
        if (!model.category && selectedCategory === "") return;
        (async () => {
            await startNewRound()
        })();
    }, [selectedCategory]);

    useEffect(() => {
        (async () => {
            if (!debouncedQuery.trim()) return setSearchResults([]);
            const titles = await searchTitles(debouncedQuery, model.category as "movie" | "tv");
            setSearchResults(titles.slice(0, 5));
        })();
    }, [debouncedQuery, model.category]);

    async function startNewRound() {
        if (isStartingFlag.current) return;
        isStartingFlag.current = true;

        didSubmitRef.current = false;
        setLoading(true);
        await model.startNewRound();
        setStartingInfo(model.startingInfo)
        setClues(model.getCurrentClues());
        setLoading(false);

        isStartingFlag.current = false;
    }

    async function makeGuess(guess: string) {
        const result = model.makeGuess(guess);
        if (!result) return;

        setTotalScore(result.score);
        setClues(model.getCurrentClues());

        if (result.correct) {
            setMessage(`Correct! The movie was "${model.title.title}".`);
            await submitScore();
            setTimeout(async () => {
                await startNewRound();
            }, 1500);

        } else if (result.lose) {
            setMessage(`You lose! The movie was "${model.title.title}".`);
            await submitScore();
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
        didSubmitRef.current = false;
        setMessage("");
        setGameOver(false);
        setSelectedCategory("");
        setClues([]);
        setStartingInfo([]);
    }

    const submitScore = async () => {
        if (didSubmitRef.current) return;
        if (model.totalScore != null && model.category) {
            didSubmitRef.current = true;
            try {
                await submitGameScore(model.totalScore, model.category);
            } catch (e) {
                console.error("Failed to submit score:", e);
            }
        }
    };

    function onQueryChange(value: string) {
        setQuery(value);
    }

    function onSelectSuggestion(title: string) {
        setQuery(title);
        setSearchResults([]);
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
            query={query}
            onQueryChange={onQueryChange}
            searchResults={searchResults}
            onSelectSuggestion={onSelectSuggestion}
        />
);
});
