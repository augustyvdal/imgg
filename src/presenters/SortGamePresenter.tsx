import SortGameView from "../views/SortGameView"
import {observer} from "mobx-react-lite"
import { use, useState } from "react";
import { SortGameModel } from "../models/SortGameModel";
import { Content } from "../services/apiClient";

type SortGamePresenterProps = {
    model: SortGameModel;
}


export default observer (
    function SortGamePresenter({model}: SortGamePresenterProps) {
        const [isLoaded, setIsLoaded] = useState(false);
        const [contentList, setContentList] = useState<Content[]>([]);
        const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
        const [triesRemaining, setTriesRemaining] = useState(model.maxTries);
        const [shake, setShake] = useState(false);
        const [streak, setStreak] = useState(model.roundStreak);

        const [nextRoundReady, setNextRoundReady] = useState(false);
        const [resetReady, setResetReady] = useState(false);
        const [submitReady, setSubmitReady] = useState(false);

        const handleCategorySelect = async (category: string) => {
            model.chooseSortCategory(category);
            await model.GetAllContent(5)
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
                setFeedbackMessage("That was your last try! Click 'try again' to restart!");
                setResetReady(true);
            }
            
            setTriesRemaining(model.triesRemaining);
        };

        const newRoundOrReset = () => {
            setFeedbackMessage(null);
            setTriesRemaining(model.maxTries);
            setContentList([]);
            setNextRoundReady(false);
            setResetReady(false);
            setSubmitReady(true);
        }

        const handleNextRound = async () => {
            newRoundOrReset();
            await model.newRound();
            setContentList(model.returnAllContent())
        }

        const handleReset = () => {
            model.resetSortGame();
            newRoundOrReset();
            setStreak(model.roundStreak);
        };

        return (
        <SortGameView
        content={model.allContent}
        onReorder={handleReorder}
        onSubmit={handleSubmit}
        onReset={handleReset}
        feedback={feedbackMessage}
        onCategorySelect={handleCategorySelect}
        category={model.sortCategory}
        triesLeft={triesRemaining}
        shake={shake}
        nextRound={nextRoundReady}
        reset={resetReady}
        submit={submitReady}
        onNextRound={handleNextRound}
        streak={streak}
        />
        );
    }
)


