/// <reference types="cypress" />

import React from "react";
import GuessTheMoviePresenter from "../../src/presenters/GuessTheMoviePresenter";

const initialState = () => ({
  totalScore: 0,
  category: "" as "" | "movie" | "tv",
  title: { title: "Terminator 2: Judgment Day" },
  startingInfo: ["Year: 1991", "Action, Thriller, Science Fiction"],
});

const clues = [
  "Director: James Cameron",
  "Main Actors: Arnold Schwarzenegger, Linda Hamilton, Edward Furlong",
  "Characters: The Terminator, Sarah Connor, John Connor",
  "Plot: Ten years after the events of the original, a reprogrammed T-800 is sent back in time to protect young John Connor from the shape-shifting T-1000.",
];

function makeFakeModel() {
  return {
    createInitialState: cy.stub().callsFake(initialState),

    chosenCategory: cy.stub().callsFake((state: ReturnType<typeof initialState>, category: "movie" | "tv") => ({
      ...state,
      category,
    })),

    startNewRound: cy.stub().callsFake(async (state: ReturnType<typeof initialState>) => {
      return state;
    }),

    getCurrentClues: cy.stub().callsFake((_state: ReturnType<typeof initialState>) => clues),

    makeGuess: cy.stub().callsFake((state: ReturnType<typeof initialState>, guess: string) => {
      if (guess.trim().toLowerCase() === "terminator 2: judgment day".toLowerCase()) {
        return { state: { ...state, totalScore: state.totalScore + 10 }, correct: true, lose: false };
      }
      return { state, correct: false, lose: true };
    }),

    restartGame: cy.stub().callsFake((_state: ReturnType<typeof initialState>) => initialState()),
  };
}

function pickCategory() {
  cy.get("body").then(($body) => {
    const btn = Array.from($body[0].querySelectorAll("button"))
      .map((n) => n as HTMLButtonElement)
      .find((b) => /movie|movies|tv|series/i.test(b.innerText)) ?? undefined;
    if (btn) cy.wrap(btn).click({ force: true });
  });
}

function typeGuessAndSubmit(text: string) {
  cy.get('input[type="text"], input:not([type])').first().type(text, { force: true });

  cy.get("body").then(($body) => {
    const btn = Array.from($body[0].querySelectorAll("button"))
      .map((n) => n as HTMLButtonElement)
      .find((b) => /guess|submit|enter/i.test(b.innerText) && !b.disabled && b.offsetParent !== null);
    if (btn) cy.wrap(btn).click({ force: true });
  });
}

describe("GuessTheMoviePresenter (component)", () => {
  it("shows clues after starting a round", () => {
    const model = makeFakeModel();
    cy.mount(<GuessTheMoviePresenter model={model} />);

    pickCategory();

    cy.wrap(model.startNewRound).its("callCount").should("be.gte", 1);

    cy.contains(/Director:/i).should("be.visible");
    cy.contains(/Main Actors:/i).should("be.visible");
    cy.contains(/Characters:/i).should("be.visible");
    cy.contains(/Plot:/i).should("be.visible");
  });

  it("on correct guess shows 'Correct!' then queues next round", () => {
    cy.clock();

    const model = makeFakeModel();
    cy.mount(<GuessTheMoviePresenter model={model} />);

    pickCategory();
    cy.wrap(model.startNewRound).its("callCount").should("be.gte", 1);

    typeGuessAndSubmit("Terminator 2: Judgment Day");

    cy.contains(/Correct!\s*The movie was "Terminator 2: Judgment Day"/i).should("be.visible");

    cy.tick(1500);
    cy.wrap(model.startNewRound).its("callCount").should("be.gte", 2);
  });

  it("on losing guess shows 'You lose!' and game over", () => {
    const model = makeFakeModel();
    cy.mount(<GuessTheMoviePresenter model={model} />);

    pickCategory();
    cy.wrap(model.startNewRound).its("callCount").should("be.gte", 1);

    typeGuessAndSubmit("Wrong title");

    cy.contains(/You lose!\s*The movie was "Terminator 2: Judgment Day"/i).should("be.visible");
  });
});
