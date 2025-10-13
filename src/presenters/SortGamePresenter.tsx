import SortGameView from "../views/SortGameView"
import {observer} from "mobx-react-lite"
import { useEffect, useState } from "react";
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

        /*
        useEffect(() => {
                model.GetAllContent(5)
                .then(() => setIsLoaded(true))}
                ,[model]);
        */

        const handleCategorySelect = async (category: string) => {
            model.chooseSortCategory(category);
            await model.GetAllContent(5)
            console.log(model.sortCategory);
            setContentList(model.returnAllContent());
        } 

        const handleReorder = (fromIndex: number, toIndex: number) => {
            model.reorderContent(fromIndex, toIndex)
            setContentList(model.returnAllContent())
        };

        const handleSubmit = () => {
            const correct = model.checkOrderCorrect();
            setFeedbackMessage(correct ? "Correct order!" : "Wrong order, try again!")
        }

        return (
        <SortGameView
        content={model.allContent}
        onReorder={handleReorder}
        onSubmit={handleSubmit}
        feedback={feedbackMessage}
        onCategorySelect={handleCategorySelect}
        category={model.sortCategory}
        />
        );
    }
)


