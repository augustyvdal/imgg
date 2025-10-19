import {type JSX, useRef} from "react";
import { Routes, Route, useLocation } from "react-router-dom";


import HigherLowerPresenter from "../presenters/HigherLowerPresenter";
import HigherLowerModel from "../models/HigherLowerModel";

import funcSortGameModel from "../models/funcSortGameModel";
import SortGamePresenter from "../presenters/funcSortGamePresenter";

import GuessTheMoviePresenter from "../presenters/GuessTheMoviePresenter";
import GuessTheMovieModel from "../models/GuessTheMovieModel";

import ProfileModel from "../models/ProfileModel";

import HomePresenter from "../presenters/HomePresenter";

import LoginPresenter from "../presenters/LoginPresenter";

import LeaderboardPresenter from "../presenters/LeaderboardPresenter";
import ProfilePresenter from "../presenters/ProfilePresenter";


const AppRoutes = (): JSX.Element => {
    const location = useLocation();
    const nodeRef = useRef<HTMLDivElement | null>(null);

    return (
        <div ref={nodeRef}>
            <Routes location={location}>
                <Route path="/" element={<HomePresenter />} />
                <Route path="/profile" element={<ProfilePresenter model={ProfileModel} />} />
                <Route path="/login" element={<LoginPresenter />} />
                <Route path="/game1" element={<GuessTheMoviePresenter model={GuessTheMovieModel} />} />
                <Route path="/game2" element={<HigherLowerPresenter model={HigherLowerModel} />} />
                <Route path="/game3" element={<SortGamePresenter model={funcSortGameModel} />} />
                <Route path="/leaderboard" element={<LeaderboardPresenter />} />
            </Routes>
        </div>
    );
};

export default AppRoutes;