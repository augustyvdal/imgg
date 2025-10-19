import {type JSX, useRef} from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import SortGamePresenter from "../presenters/SortGamePresenter";
import { SortGameModel } from "../models/SortGameModel"

import HigherLowerPresenter from "../presenters/HigherLowerPresenter";
import { HigherLowerModel } from "../models/HigherLowerModel";

import GuessTheMoviePresenter from "../presenters/GuessTheMoviePresenter";
import {GuessTheMovieModel} from "../models/GuessTheMovieModel";

import HomePresenter from "../presenters/HomePresenter";

import LoginPresenter from "../presenters/LoginPresenter";
import ProfilePage from "../views/ProfileView";

import LeaderboardPresenter from "../presenters/LeaderboardPresenter";
import ProfilePresenter from "../presenters/ProfilePresenter";

const higherLowerModel = new HigherLowerModel();
const sortGameModel = new SortGameModel();
const guessTheMovieModel = new GuessTheMovieModel();

const AppRoutes = (): JSX.Element => {
    const location = useLocation();
    const nodeRef = useRef<HTMLDivElement | null>(null);

    return (
        <div ref={nodeRef}>
            <Routes location={location}>
                <Route path="/" element={<HomePresenter />} />
                <Route path="/profile" element={<ProfilePresenter />} />
                <Route path="/login" element={<LoginPresenter />} />
                <Route path="/game1" element={<GuessTheMoviePresenter model={guessTheMovieModel} />} />
                <Route path="/game2" element={<HigherLowerPresenter model={higherLowerModel} />} />
                <Route path="/game3" element={<SortGamePresenter model={sortGameModel} />} />
                <Route path="/leaderboard" element={<LeaderboardPresenter />} />
            </Routes>
        </div>
    );
};

export default AppRoutes;