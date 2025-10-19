import SortGameView from "../views/SortGameView"
import {observer} from "mobx-react-lite"
import { useState, useRef, useEffect} from "react";
import funcSortGameModel from "../models/funcSortGameModel"
import { Content } from "../services/apiClient";
import { submitSortStreak } from "../services/sortGameLeaderboardService"
import { set } from "mobx";

type SortGamePresenterProps = {
    model: typeof funcSortGameModel;
}


export default observer (
    function SortGamePresenter({model}: SortGamePresenterProps) {
        const [sortState, setSortState] = useState(model.createInitSortGameState());
        const [loading, setLoading] = useState(false);
        const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
        const [shake, setShake] = useState(false);

        const [nextRoundReady, setNextRoundReady] = useState(false);
        const [resetReady, setResetReady] = useState(false);
        const [submitReady, setSubmitReady] = useState(false);

        const didSubmitRef = useRef(false);

        useEffect(() => {
            setSortState(model.createInitSortGameState());
        }, [model]);

        const handleCategorySelect = async (category: string) => {
            setLoading(true);
            didSubmitRef.current = false;
            
            const stateWithCategory = model.chooseSortCategory(sortState, category);
            //setSortState(stateWithCategory);

            const stateWithFetchedContent = await model.GetAllContent(stateWithCategory, 5);
            setSortState(stateWithFetchedContent);
            
            setFeedbackMessage(null);
            setSubmitReady(true);
            setLoading(false);
        };

        const handleReorder = (fromIndex: number, toIndex: number) => {
            const stateWithReorder = model.reorderContent(sortState, fromIndex, toIndex);
            setSortState(stateWithReorder);
        };

        const handleSubmit = () => {
            const correct = model.checkOrderCorrect(sortState);

            setSubmitReady(false);
            setNextRoundReady(false);
            setResetReady(false);
            
            if (correct) {
                setFeedbackMessage("CORRECT!!!");
                const stateWithStreakIncr = model.incrementRoundStreak(sortState);
                setSortState(stateWithStreakIncr);
                setNextRoundReady(true);
                return;
            }

            const stateWithTriesDec = model.decrementTriesRemaining(sortState);
            setSortState(stateWithTriesDec);

            const correctCount = model.countCorrectPlaces(sortState);

            if (sortState.triesRemaining > 0) {
                setFeedbackMessage(`Wrong order, try again. You had ${correctCount} out of ${sortState.allContent.length} in the correct place! You have ${sortState.triesRemaining} tries remaining!`);
                setShake(true);
                setTimeout(() => setShake(false), 500);
                setSubmitReady(true);
            } else {
                submitRoundStreak();
                setFeedbackMessage("That was your last try!");
                setResetReady(true);
            }
        };

        const newRoundOrReset = () => {
            didSubmitRef.current = false;
            setFeedbackMessage(null);
            setNextRoundReady(false);
            setResetReady(false);
            setSubmitReady(true);
        }

        const handleNextRound = async () => {
            newRoundOrReset();
            setLoading(true);

            const stateWithNewRound = await model.newRound(sortState);
            setSortState(stateWithNewRound);

            setLoading(false);
        }

        const handleReset = () => {
            const stateWithReset = model.resetSortGame(sortState);
            setSortState(stateWithReset);
            newRoundOrReset();
        };

        const submitRoundStreak = async () => {
            if (didSubmitRef.current) return;

            if (sortState.roundStreak != null && sortState.sortCategory) {
                didSubmitRef.current = true;
                try {
                    await submitSortStreak(sortState.roundStreak, sortState.sortCategory);
                } catch (e) {
                    console.error("Failed to submit score:", e);
                }
            }
        };

        return (
        <SortGameView
        content={sortState.allContent}
        onReorder={handleReorder}
        onSubmit={handleSubmit}
        onReset={handleReset}
        feedback={feedbackMessage}
        onCategorySelect={handleCategorySelect}
        category={sortState.sortCategory}
        triesLeft={sortState.triesRemaining}
        shake={shake}
        nextRound={nextRoundReady}
        reset={resetReady}
        submit={submitReady}
        onNextRound={handleNextRound}
        streak={sortState.roundStreak}
        loading={loading}
        />
        );
    }
)


