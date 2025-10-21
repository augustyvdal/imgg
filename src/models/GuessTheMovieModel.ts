import { GuessingGameAPICall } from "../services/apiClient";
import { supabase } from "../services/supabaseClient";

type GuessTheMovieState = {
    title: any;
    startingInfo: string[];
    clues: string[];
    currentClueIndex: number;
    totalScore: number;
    gameOver: boolean;
    category: string;
};

export default {
    createInitialState(): GuessTheMovieState {
        return {
            title: null,
            startingInfo: [],
            clues: [],
            currentClueIndex: -1,
            totalScore: 0,
            gameOver: false,
            category: "",
        };
    },

    async gameScoreSave(state: GuessTheMovieState): Promise<void> {
        const { data: userData, error: userError } = await supabase.auth.getUser();

        if (userError || !userData?.user) {
            throw new Error("User not logged in or token invalid");
        }

        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;

        const response = await fetch("/api/guessGame", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                score: state.totalScore,
                category: state.category,
            }),
        });
        if (!response.ok) {
            throw new Error(`Failed to save game score: ${response.statusText}`);
        }
    },

    async startNewRound(state: GuessTheMovieState): Promise<GuessTheMovieState> {
        const titleData = await GuessingGameAPICall(state.category);

        const startingInfo = [
            `Release year: ${titleData.release_year}`,
            `Genre(s): ${titleData.genres}`,
            `TMDb Rating: ${titleData.tmdb_rating}`,
        ];

        const clues = [
            `Director: ${titleData.director}`,
            `Main Actors: ${titleData.main_actors}`,
            `Characters: ${titleData.characters.join(", ")}`,
            `Plot: ${titleData.description.split(".")[0]}.`,
        ];

        return {
            ...state,
            title: titleData,
            startingInfo,
            clues,
            currentClueIndex: -1,
            gameOver: false,
            totalScore: state.totalScore,
        };
    },

    makeGuess(state: GuessTheMovieState, guess: string): {
        state: GuessTheMovieState;
        correct: boolean;
        lose?: boolean;
        score: number;
        nextClue?: string[];
        remaining?: number;
    } {
        if (state.gameOver || !state.title)
            return { state, correct: false, score: state.totalScore };

        const normalizedGuess = guess.trim().toLowerCase();
        const normalizedTitle = state.title.title.toLowerCase();

        if (normalizedGuess === normalizedTitle) {
            const score = state.clues.length - state.currentClueIndex;
            const total = state.totalScore + score;
            return {
                state: { ...state, totalScore: total },
                correct: true,
                score: total,
            };
        }

        const nextClueIndex = state.currentClueIndex + 1;
        const lose = nextClueIndex >= state.clues.length;

        const updatedState: GuessTheMovieState = {
            ...state,
            currentClueIndex: nextClueIndex,
            gameOver: lose,
            totalScore: lose ? 0 : state.totalScore
        };

        return {
            state: updatedState,
            correct: false,
            lose,
            score: state.totalScore,
            nextClue: this.getCurrentClues(updatedState),
            remaining: state.clues.length - nextClueIndex,
        };
    },

    chosenCategory(state: GuessTheMovieState, category: "movie" | "tv"): GuessTheMovieState {
        return { ...state, category };
    },

    getCurrentClues(state: GuessTheMovieState): string[] {
        return state.clues.slice(0, state.currentClueIndex + 1);
    },

    restartGame(state: GuessTheMovieState): GuessTheMovieState {
        return {
            ...state,
            totalScore: 0,
            gameOver: false,
            currentClueIndex: 0,
            title: null,
        };
    },
};
