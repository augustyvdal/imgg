import {type JSX, useRef} from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "../views/GameSelector";
import GuessTheMovie from "../views/GuessTheMovie";
import HigherLowerPresenter from "../presenters/HigherLowerPresenter";
import { HigherLowerModel } from "../models/higherLowerModel";
import OrderBy from "../views/OrderBy";


type Props = {
  higherLowerModel: HigherLowerModel;
};

const AppRoutes = ({ higherLowerModel }: Props): JSX.Element => {
  const location = useLocation();
  const nodeRef = useRef<HTMLDivElement | null>(null);

    return (
        <div ref={nodeRef}>
            <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/game1" element={<GuessTheMovie />} />
                <Route path="/game2" element={<HigherLowerPresenter model={higherLowerModel} />} />
                <Route path="/game3" element={<OrderBy />} />
            </Routes>
        </div>
    );
};

export default AppRoutes;