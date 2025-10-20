/// <reference types="cypress" />

import React from "react";
import SortGamePresenter from "../../src/presenters/funcSortGamePresenter";
import type { Content } from "../../src/services/apiClient";

const C = (id: number, title: string, vote: number): Content => ({
  id,
  title,
  name: title,
  poster_path: undefined,
  vote_average: vote,
});

function makeFakeModel() {
  const baseState = {
    allContent: [
      C(1, "Alpha", 8.0),
      C(2, "Bravo", 7.5),
      C(3, "Charlie", 7.0),
      C(4, "Delta", 6.8),
      C(5, "Echo", 6.5),
    ] as Content[],
    sortCategory: "",
    maxTries: 3,
    triesRemaining: 3,
    roundStreak: 0,
  };

  const api = {
    createInitSortGameState: cy.stub().callsFake(() => ({ ...baseState })),

    chooseSortCategory: cy.stub().callsFake((state, category: string) => ({
      ...state,
      sortCategory: category,
    })),

    GetAllContent: cy.stub().callsFake(async (state, amount: number) => ({
      ...state,
      allContent: state.allContent.slice(0, amount),
    })),

    reorderContent: cy.stub().callsFake((state, fromIndex: number, toIndex: number) => {
      const updated = [...state.allContent];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return { ...state, allContent: updated };
    }),

    checkOrderCorrect: cy.stub().callsFake((_state) => false),
    countCorrectPlaces: cy.stub().callsFake((_state) => 0),

    decrementTriesRemaining: cy.stub().callsFake((state) => ({
      ...state,
      triesRemaining: Math.max(0, state.triesRemaining - 1),
    })),

    incrementRoundStreak: cy.stub().callsFake((state) => ({
      ...state,
      roundStreak: state.roundStreak + 1,
    })),

    newRound: cy.stub().callsFake(async (state) => ({
      ...state,
      triesRemaining: state.maxTries,
      allContent: [...state.allContent],
    })),

    resetSortGame: cy.stub().callsFake((_state) => ({
      ...baseState,
    })),
  };

  return api;
}

function pickCategory() {
  cy.get('[data-cy="pick-movie"]').click({ force: true });
}
function clickSubmit() {
  cy.get('[data-cy="submit"]').click({ force: true });
}
function clickNextRound() {
  cy.get('[data-cy="next-round"]').click({ force: true });
}
function clickTryAgain() {
  cy.get('[data-cy="reset"]').click({ force: true });
}

describe("SortGamePresenter (component)", () => {
  it("starts a round after category select and shows items", () => {
    const model = makeFakeModel();
    cy.wrap(model.GetAllContent).as("getAll");


    cy.mount(<SortGamePresenter model={model as any} />);

    pickCategory();

    cy.get("@getAll").should("have.been.called");
    cy.contains(/Alpha|Bravo|Charlie/i).should("be.visible");
  });

  it("on correct submit shows CORRECT!!! and enables next round", () => {
    const model = makeFakeModel();
    model.checkOrderCorrect.callsFake(() => true);
    cy.wrap(model.newRound).as("newRound");
    cy.wrap(model.incrementRoundStreak).as("incr");


    cy.mount(<SortGamePresenter model={model as any} />);

    pickCategory();
    clickSubmit();

    cy.contains(/CORRECT!!!/i).should("be.visible");
    cy.get("@incr").should("have.been.called");

    cy.get('[data-cy="next-round"]').should("exist");
    clickNextRound();

    cy.get("@newRound").should("have.been.called");
  });

  it("on wrong submit (tries remain) shows hint and decrements tries", () => {
    const model = makeFakeModel();
    model.countCorrectPlaces.callsFake(() => 2);
    cy.wrap(model.decrementTriesRemaining).as("dec");


    cy.mount(<SortGamePresenter model={model as any} />);

    pickCategory();
    clickSubmit();

    cy.contains(/Wrong order/i).should("be.visible");
    cy.get("@dec").should("have.been.called");
  });

  it("on last try shows final message and offers reset", () => {
    const model = makeFakeModel();
    cy.wrap(model.resetSortGame).as("reset");

    model.createInitSortGameState.callsFake(() => ({
      allContent: [
        C(1, "Alpha", 8.0),
        C(2, "Bravo", 7.5),
        C(3, "Charlie", 7.0),
        C(4, "Delta", 6.8),
        C(5, "Echo", 6.5),
      ],
      sortCategory: "",
      maxTries: 3,
      triesRemaining: 1,
      roundStreak: 0,
    }));

    cy.mount(<SortGamePresenter model={model as any} />);

    pickCategory();
    clickSubmit(); 
    clickSubmit();  

    cy.contains(/last try/i).should("be.visible");

    clickTryAgain();

    cy.get("@reset").should("have.been.called");
  });
});
