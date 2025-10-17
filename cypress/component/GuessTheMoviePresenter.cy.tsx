/// <reference types="cypress" />

import React from "react";
import GuessTheMoviePresenter from "../../src/presenters/GuessTheMoviePresenter";
import type { GuessTheMovieModel } from "../../src/models/GuessTheMovieModel";

type TitleLike = { title: string };

class FakeModel {
    category: "movie" | "tv" = "movie";
    totalScore = 0;

    startingInfo: string[] = ["Year: 1991", "Action, Thriller, Science Fiction"];
    title: TitleLike = { title: "Terminator 2: Judgment Day" };

    chosenCategory = cy.stub();
    restartGame   = cy.stub();

    startNewRound = cy.stub().callsFake(async () => {
        this.totalScore = 0;
    });

    getCurrentClues = cy.stub().callsFake(() => [
        "Director: James Cameron",
        "Main Actors: Arnold Schwarzenegger, Linda Hamilton, Edward Furlong",
        "Characters: The Terminator, Sarah Connor, John Connor",
        "Plot: Ten years after the events of the original, a reprogrammed T-800 is sent back in time to protect young John Connor from the shape-shifting T-1000.",
    ]);

    makeGuess = cy.stub().returns({ score: 0, correct: false, lose: false });
}

function pickCategory() {
    cy.get("body").then(($body) => {
        const buttons = Array.from(
            $body[0].querySelectorAll("button")
        ) as HTMLButtonElement[];

        const match =
            buttons.find((b) => /movie|movies|tv|series/i.test(b.innerText)) ??
            buttons.find((b) => b.offsetParent !== null);

        if (match) cy.wrap(match).click({ force: true });
  });
}

function typeGuessAndSubmit(text: string) {
    cy.get('input[type="text"], input:not([type])').first().type(text, { force: true });

    cy.get("body").then(($body) => {
        const buttons = Array.from(
            $body[0].querySelectorAll("button")
        ) as HTMLButtonElement[];

        const btn =
            buttons.find(
            (b) =>
                /guess|submit|enter/i.test(b.innerText) && !b.disabled && b.offsetParent !== null
            ) ?? buttons.find((b) => !b.disabled && b.offsetParent !== null);

        if (btn) cy.wrap(btn).click({ force: true });
    });
}

describe("GuessTheMoviePresenter (component)", () => {
    it("shows clues after starting a round", () => {
        const model = new FakeModel();

        cy.mount(<GuessTheMoviePresenter model={model as unknown as GuessTheMovieModel} />);

        pickCategory();

        cy.wrap(model.startNewRound).its("callCount").should("be.gte", 1);

        cy.contains(/Director:/i).should("be.visible");
        cy.contains(/Main Actors:/i).should("be.visible");
        cy.contains(/Characters:/i).should("be.visible");
        cy.contains(/Plot:/i).should("be.visible");
    });

    it("on correct guess shows 'Correct!' then queues next round", () => {
        cy.clock();

        const model = new FakeModel();
        model.makeGuess.returns({ score: 10, correct: true, lose: false });

        cy.mount(<GuessTheMoviePresenter model={model as unknown as GuessTheMovieModel} />);

        pickCategory();
        cy.wrap(model.startNewRound).its("callCount").should("be.gte", 1);

        typeGuessAndSubmit("Terminator 2: Judgment Day");

        cy.contains(/Correct!\s*The movie was "Terminator 2: Judgment Day"/i).should(
            "be.visible"
        );

        cy.tick(1500);

        cy.wrap(model.startNewRound).its("callCount").should("be.gte", 2);
    });

    it("on losing guess shows 'You lose!' and game over", () => {
        const model = new FakeModel();
        model.makeGuess.returns({ score: 7, correct: false, lose: true });

        cy.mount(<GuessTheMoviePresenter model={model as unknown as GuessTheMovieModel} />);

        pickCategory();
        cy.wrap(model.startNewRound).its("callCount").should("be.gte", 1);

        typeGuessAndSubmit("Wrong title");

        cy.contains(/You lose!\s*The movie was "Terminator 2: Judgment Day"/i).should(
            "be.visible"
        );
    });
});
