import SortGameView from "../views/SortGameView"
import {observer} from "mobx-react-lite"
import { use, useState, useRef} from "react";
import { SortGameModel } from "../models/SortGameModel";
import { Content } from "../services/apiClient";
import { submitSortStreak } from "../services/sortGameLeaderboardService"
import { set } from "mobx";

type SortGamePresenterProps = {
    model: SortGameModel;
}


export default observer (
    function SortGamePresenter({model}: SortGamePresenterProps) {
        const [loading, setLoading] = useState(false);
        const [contentList, setContentList] = useState<Content[]>([]);
        const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
        const [triesRemaining, setTriesRemaining] = useState(model.maxTries);
        const [shake, setShake] = useState(false);
        const [streak, setStreak] = useState(model.roundStreak);

        const [nextRoundReady, setNextRoundReady] = useState(false);
        const [resetReady, setResetReady] = useState(false);
        const [submitReady, setSubmitReady] = useState(false);
        const [selectedCategory, setSelectedCategory] = useState<string>("");

        const didSubmitRef = useRef(false);

        const handleCategorySelect = async (category: string) => {
            didSubmitRef.current = false;
            model.chooseSortCategory(category);
            setSelectedCategory(category);
            setLoading(true);
            await model.GetAllContent(5)
            setLoading(false);
            setContentList(model.returnAllContent());
            setFeedbackMessage(null);
            setTriesRemaining(model.maxTries);
            setSubmitReady(true);
        };

        const handleReorder = (fromIndex: number, toIndex: number) => {
            model.reorderContent(fromIndex, toIndex)
            setContentList(model.returnAllContent())
        };

        const handleSubmit = () => {
            const correct = model.checkOrderCorrect();

            setSubmitReady(false);
            setNextRoundReady(false);
            setResetReady(false);
            
            if (correct) {
                setFeedbackMessage("CORRECT!!!");
                model.incrementRoundStreak();
                setStreak(model.roundStreak);
                setNextRoundReady(true);
                return;
            }

            model.decrementTriesRemaining();
            const correctCount = model.countCorrectPlaces();

            if (model.triesRemaining > 0) {
                setFeedbackMessage(`Wrong order, try again. You had ${correctCount} out of ${model.allContent.length} in the correct place!`);
                setShake(true);
                setTimeout(() => setShake(false), 500);
                setSubmitReady(true);
            } else {
                submitRoundStreak();
                setFeedbackMessage("That was your last try! Click 'try again' to restart!");
                setResetReady(true);
            }
            
            setTriesRemaining(model.triesRemaining);
        };

        const newRoundOrReset = () => {
            didSubmitRef.current = false;
            setSelectedCategory("");
            setFeedbackMessage(null);
            setTriesRemaining(model.maxTries);
            setContentList([]);
            setNextRoundReady(false);
            setResetReady(false);
            setSubmitReady(true);
        }

        const handleNextRound = async () => {
            newRoundOrReset();
            setLoading(true);
            await model.newRound();
            setContentList(model.returnAllContent())
            setLoading(false);
        }

        const handleReset = () => {
            model.resetSortGame();
            newRoundOrReset();
            setStreak(model.roundStreak);
        };

        const submitRoundStreak = async () => {
                if (didSubmitRef.current) return;
                if (model.roundStreak != null && model.sortCategory) {
                    didSubmitRef.current = true;
                    try {
                        await submitSortStreak(model.roundStreak, model.sortCategory);
                    } catch (e) {
                        console.error("Failed to submit score:", e);
                    }
                }
            };

        return (
        <SortGameView
        content={model.allContent}
        onReorder={handleReorder}
        onSubmit={handleSubmit}
        onReset={handleReset}
        feedback={feedbackMessage}
        onCategorySelect={handleCategorySelect}
        category={selectedCategory}
        triesLeft={triesRemaining}
        shake={shake}
        nextRound={nextRoundReady}
        reset={resetReady}
        submit={submitReady}
        onNextRound={handleNextRound}
        streak={streak}
        loading={loading}
        />
        );
    }
)


