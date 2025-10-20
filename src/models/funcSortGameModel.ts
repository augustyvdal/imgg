//import { faFolderMinus } from "@fortawesome/free-solid-svg-icons";
import { GetContentFromTMDB, Content } from "../services/apiClient";

export type SortGameState = {
        allContent: Content[];
        sortCategory: string;
        maxTries: number;
        triesRemaining: number;
        roundStreak: number;
    }


export default {
    createInitSortGameState(): SortGameState {
        return {
        allContent: [],
        sortCategory: "",
        maxTries: 3,
        triesRemaining: 3,
        roundStreak: 0,
        }
    },

    async GetAllContent(
        state: SortGameState,
        amount: number
    ): Promise<SortGameState> {
        const allContent = await GetContentFromTMDB(amount, state.sortCategory);
        return { ...state, allContent};
    },

    chooseSortCategory(
        state: SortGameState,
        category: string,
    ): SortGameState {
        return { ...state, sortCategory: category };
    },

    reorderContent(
        state: SortGameState,
        fromIndex: number,
        toIndex: number
    ): SortGameState {
        const updated = [...state.allContent];
        const [moved] = updated.splice(fromIndex, 1);
        updated.splice(toIndex, 0, moved);
        return { ...state, allContent: updated };
    },

    checkOrderCorrect(state: SortGameState): boolean {
    if (!state.allContent || state.allContent.length === 0) return false;

    return state.allContent.every((item, index, array) => {
        if (index === array.length - 1) return true;
        return (item.vote_average || 0) >= (array[index + 1].vote_average || 0);
    });
    },

    countCorrectPlaces(state: SortGameState): number {
    if (!state.allContent || state.allContent.length === 0) return 0;

    const correctOrder = [...state.allContent].sort(
        (a, b) => (b.vote_average || 0) - (a.vote_average || 0)
    );

    return state.allContent.reduce(
        (count, item, i) => (item.id === correctOrder[i].id ? count + 1 : count),
        0
    );
    },

    decrementTriesRemaining(state: SortGameState): SortGameState {
    return {
        ...state,
        triesRemaining: Math.max(0, state.triesRemaining - 1),
    };
    },

    incrementRoundStreak(state: SortGameState): SortGameState {
    return {
        ...state,
        roundStreak: state.roundStreak + 1,
    };
    },

    async newRound(state: SortGameState): Promise<SortGameState> {
    const resetState = {
        ...state,
        triesRemaining: state.maxTries,
        allContent: [],
    };
    return await this.GetAllContent(resetState, 5);
    },


    resetSortGame(state: SortGameState): SortGameState {
    return {
        ...state,
        triesRemaining: state.maxTries,
        allContent: [],
        sortCategory: "",
        roundStreak: 0,
    };
    },
}