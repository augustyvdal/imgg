import {type JSX, useRef} from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "../views/GameSelector";
import GuessTheMovie from "../views/GuessTheMovie";
import HigherLower from "../views/HigherLowerView";
import SortGamePresenter from "../presenters/SortGamePresenter";
import { SortGameModel } from "../models/SortGameModel"
import HigherLowerPresenter from "../presenters/HigherLowerPresenter";
import { HigherLowerModel } from "../models/higherLowerModel";
import OrderBy from "../views/OrderBy";
import LoginPage from "../views/LoginPage";

type Props = {
  higherLowerModel: HigherLowerModel;
  sortGameModel: SortGameModel;
};

const AppRoutes = ({higherLowerModel, sortGameModel}: Props): JSX.Element => {
    const location = useLocation();
    const nodeRef = useRef<HTMLDivElement | null>(null);

    return (
        <div ref={nodeRef}>
            <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/game1" element={<GuessTheMovie />} />
                <Route path="/game2" element={<HigherLowerPresenter model={higherLowerModel} />} />
                <Route path="/game3" element={<SortGamePresenter model={sortGameModel} />} />
            </Routes>
        </div>
    );
};

export default AppRoutes;