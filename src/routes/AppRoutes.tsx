import {type JSX, useRef} from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "../views/GameSelector";
import SortGamePresenter from "../presenters/SortGamePresenter";
import { SortGameModel } from "../models/SortGameModel"
import HigherLowerPresenter from "../presenters/HigherLowerPresenter";
import { HigherLowerModel } from "../models/higherLowerModel";
import GuessTheMoviePresenter from "../presenters/GuessTheMoviePresenter";
import {GuessTheMovieModel} from "../models/GuessTheMovieModel";
import LoginPage from "../views/LoginPage";
import ProfilePage from "../views/ProfilePage";

const higherLowerModel = new HigherLowerModel();
const sortGameModel = new SortGameModel();
const guessTheMovieModel = new GuessTheMovieModel();

const AppRoutes = (): JSX.Element => {
    const location = useLocation();
    const nodeRef = useRef<HTMLDivElement | null>(null);

    return (
        <div ref={nodeRef}>
            <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/game1" element={<GuessTheMoviePresenter model = {guessTheMovieModel} />} />
                <Route path="/game2" element={<HigherLowerPresenter model={higherLowerModel} />} />
                <Route path="/game3" element={<SortGamePresenter model={sortGameModel} />} />
            </Routes>
        </div>
    );
};

export default AppRoutes;