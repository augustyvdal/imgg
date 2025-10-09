import SortGameView from "../views/SortGameView"
import {observer} from "mobx-react-lite"
import { useEffect, useState } from "react";
import { SortGameModel } from "../models/SortGameModel";

type SortGamePresenterProps = {
    model: SortGameModel;
}


export default observer (
    function SortGamePresenter({model}: SortGamePresenterProps) {
        const [isLoaded, setIsLoaded] = useState(false);

        useEffect(() => {
                model.GetAllContent(5)
                .then(() => setIsLoaded(true))}
                ,[model]);
        
        const onReorder = () => {
            console.log("reorder registered");
        };

        return (
        <SortGameView
        content={model.getAllContent()}
        onReorder={onReorder}
        />
    );
    }
)


