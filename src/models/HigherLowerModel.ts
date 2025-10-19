import { shuffle } from "cypress/types/lodash";
import { fetchHigherLower, Content } from "../services/apiClient";

type HigherLowerState = {
  allContent: Content[];
  contentA: Content | null;
  contentB: Content | null;
  score: number;
  category: string;
};

export default {
    // Creates the initial state for HigherLowerModel
    createInitialState(): HigherLowerState {
        return {
            allContent: [],
            contentA: null,
            contentB: null,
            score: 0,
            category: "",
        };
    },

    shuffleArray(array: Content[]): Content[] {
        return [...array].sort(() => Math.random() - 0.5);
    },

    // Calls fetchHigherLower from apiClient and sets allContent, contentA, contentB and score
    async startNewGame(state: HigherLowerState): Promise<HigherLowerState> {
        const allContent = await fetchHigherLower(state.category);

        // Shuffle content
        const shuffledContent = this.shuffleArray(allContent);

        // Make contentA and contentB the first two elements of shuffledContent
        const contentA = shuffledContent.length > 0 ? shuffledContent[0] : null;
        const contentB = shuffledContent.length > 1 ? shuffledContent[1] : null;
        const rest = shuffledContent.slice(2);

        // Return the new state category are unchanged
        return {
            ...state,
            allContent: rest,
            contentA,
            contentB,
            score: 0,
        };
    },

    // Change the chosen category
    chosenCategory(state: HigherLowerState, category: "movie" | "tv"): HigherLowerState {
        return {
            ...state,
            category,
        };
    },

    // Returns boolean if guess is correct or not and adds score if correct
    makeGuess(state: HigherLowerState, guess: "higher" | "lower"): { state: HigherLowerState; correct: boolean } {
        // Makes sure the content is not null
        if (!state.contentA || !state.contentB) return { state, correct: false };

        const ratingA = state.contentA.vote_average || 0;
        const ratingB = state.contentB.vote_average || 0;

        const correct = (ratingB === ratingA) || (guess === "higher" && ratingB > ratingA) || (guess === "lower" && ratingA > ratingB);

        // Return updated state with +1 score if correct guess
        return {
            state: {
                ...state,
                score: correct ? state.score + 1 : state.score,
            },
            correct,
        };
    },

    // When a new round is starting, contentB becomes contentA and a new contentB is drawn from the list
    nextItem(state: HigherLowerState): HigherLowerState {
        if (!state.contentB) return state;
        const contentA = state.contentB;
        const allContent = [...state.allContent];
        const nextB = allContent.length > 0 ? allContent[0] : null;
        const rest = allContent.slice(1);
        return {
            ...state,
            contentA,
            contentB: nextB,
            allContent: rest,
        };
    }
};

