/// <reference types="cypress" />

import React from "react";
import HigherLowerPresenter from "../../src/presenters/HigherLowerPresenter";
import type { Content } from "../../src/services/apiClient";

const C = (id: number, title: string, vote: number): Content => ({
  id,
  title,
  name: title,
  poster_path: undefined,
  vote_average: vote,
});

const FakeModel: typeof import("../../src/models/HigherLowerModel").default = {
  createInitialState() {
    return {
      allContent: [],
      contentA: C(1, "A", 8),
      contentB: C(2, "B", 7),
      score: 2,
      category: "movie",
    };
  },

  shuffleArray(arr) { return arr; },

  chosenCategory(state, category) {
    return { ...state, category };
  },

  async startNewGame(state) {
    return state;
  },

  makeGuess(state, _guess) {
    return { state, correct: false };
  },

  nextItem(state) {
    return state;
  },
};


describe("HigherLowerPresenter (component)", () => {
    it("shows Game Over on wrong guess", () => {
      cy.mount(<HigherLowerPresenter model={FakeModel} />);
      cy.contains("button", /movie|tv/i).first().click({ force: true });


      cy.contains(/Score:/i).should("exist");

      cy.contains("button", /Lower/i).click();

      cy.contains(/Game Over/i).should("be.visible");
      cy.contains(/Play Again/i).should("exist");
    });
});
