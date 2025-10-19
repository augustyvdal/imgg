import {type JSX, useRef} from "react";
import { Routes, Route, useLocation } from "react-router-dom";


import HigherLowerPresenter from "../presenters/HigherLowerPresenter";
import { HigherLowerModel } from "../models/HigherLowerModel";

import funcSortGameModel from "../models/funcSortGameModel";
import SortGamePresenter from "../presenters/funcSortGamePresenter";

import GuessTheMoviePresenter from "../presenters/GuessTheMoviePresenter";
import {GuessTheMovieModel} from "../models/GuessTheMovieModel";

import HomePresenter from "../presenters/HomePresenter";

import LoginPage from "../views/LoginPage";
import ProfilePage from "../views/ProfilePage";

import LeaderboardPresenter from "../presenters/LeaderboardPresenter";

const higherLowerModel = new HigherLowerModel();
const guessTheMovieModel = new GuessTheMovieModel();

const AppRoutes = (): JSX.Element => {
    const location = useLocation();
    const nodeRef = useRef<HTMLDivElement | null>(null);

    return (
        <div ref={nodeRef}>
            <Routes location={location}>
                <Route path="/" element={<HomePresenter />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/game1" element={<GuessTheMoviePresenter model={guessTheMovieModel} />} />
                <Route path="/game2" element={<HigherLowerPresenter model={higherLowerModel} />} />
                <Route path="/game3" element={<SortGamePresenter model={funcSortGameModel} />} />
                <Route path="/leaderboard" element={<LeaderboardPresenter />} />
            </Routes>
        </div>
    );
};

export default AppRoutes;