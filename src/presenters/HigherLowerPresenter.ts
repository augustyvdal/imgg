// src/presenters/HigherLowerPresenter.ts
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import HigherLowerView from "../views/HigherLowerView";
import { higherLowerModel, Movie } from "../models/higherLowerModel";

export class HigherLowerPresenter {
    private model = higherLowerModel;

    async loadMovies(): Promise<void> {
        try {
            await this.model.fetchMovies();
        } catch (error) {
            console.error("Failed to load movies", error);
        }
    }

    handleGuess(guess: "higher" | "lower"): boolean {
    return this.model.makeGuess(guess);
    }

    nextRound(): void {
    this.model.nextRound();
    }

    get movieA(): Movie | null {
        return this.model.movieA;
    }

    get movieB(): Movie | null {
        return this.model.movieB;
    }

    get score(): number {
        return this.model.score;
    }

    get hasMovies(): boolean {
        return !!this.model.movieA && !!this.model.movieB;
    }
}

export const higherLowerPresenter = new HigherLowerPresenter();
