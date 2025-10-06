import {type JSX, useRef} from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "../views/GameSelector";
import Game1 from "../views/Game1";
import Game2 from "../views/Game2";
import Game3 from "../views/Game3";


const AppRoutes = (): JSX.Element => {
    const location = useLocation();
    const nodeRef = useRef<HTMLDivElement | null>(null);

    return (
        <div ref={nodeRef}>
            <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/game1" element={<Game1 />} />
                <Route path="/game2" element={<Game2 />} />
                <Route path="/game3" element={<Game3 />} />
            </Routes>
        </div>
    );
};

export default AppRoutes;