import {type JSX, useRef} from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "../views/GameSelector";
import GuessTheMovie from "../views/GuessTheMovie";
import HigherLower from "../views/HigherLowerView";
import OrderBy from "../views/OrderBy";


const AppRoutes = (): JSX.Element => {
    const location = useLocation();
    const nodeRef = useRef<HTMLDivElement | null>(null);

    return (
        <div ref={nodeRef}>
            <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/game1" element={<GuessTheMovie />} />
                <Route path="/game2" element={<HigherLower />} />
                <Route path="/game3" element={<OrderBy />} />
            </Routes>
        </div>
    );
};

export default AppRoutes;