/// <reference types="cypress" />

import React from "react";
import HigherLowerPresenter from "../../src/presenters/HigherLowerPresenter";
import type { HigherLowerModel } from "../../src/models/HigherLowerModel";
import type { Content } from "../../src/services/apiClient";

class FakeModel {
  category: "movie" | "tv" = "movie";
  score = 2;

  allContent: Content[] = [];
  reset = cy.stub();

  contentA: Content = { id: 1, title: "A", name: "A", poster_path: undefined, vote_average: 8 };
  contentB: Content = { id: 2, title: "B", name: "B", poster_path: undefined, vote_average: 7 };

  chosenCategory = cy.stub();
  startNewGame = cy.stub().resolves();
  nextItem = cy.stub();

  makeGuess = cy.stub().returns(false);
}

describe("HigherLowerPresenter (component)", () => {
    it("shows Game Over on wrong guess", () => {
      const model = new FakeModel();

      cy.mount(<HigherLowerPresenter model={model as unknown as HigherLowerModel} />);

      cy.contains(/^Score:/i).should("exist");

      cy.contains("button", /Lower/i).click();

      cy.contains(/Game Over/i).should("be.visible");
      cy.contains(/Play Again/i).should("exist");
    });
});
