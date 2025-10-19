/// <reference types="cypress" />

import React from "react";
import * as Router from "react-router-dom";
import HomePresenter from "../../src/presenters/HomePresenter";

function LocationProbe() {
  const loc = Router.useLocation();
  return <div data-cy-path={loc.pathname} />;
}

function mountHome(initial = "/") {
  cy.mount(
    <Router.MemoryRouter initialEntries={[initial]}>
      <LocationProbe />

      <Router.Routes>
        <Router.Route path="/" element={<HomePresenter />} />
        <Router.Route path="/game1" element={<div data-cy="game1">Game1</div>} />
        <Router.Route path="/game2" element={<div data-cy="game2">Game2</div>} />
        <Router.Route path="/game3" element={<div data-cy="game3">Game3</div>} />
      </Router.Routes>
    </Router.MemoryRouter>
  );
}

describe("HomePresenter (component)", () => {
  it("to /game1", () => {
    mountHome();
    cy.get('[data-cy="start-guess"]').click();  
    cy.get('[data-cy-path]').should("have.attr", "data-cy-path", "/game1");
    cy.get('[data-cy="game1"]').should("exist");
  });

  it("to /game2", () => {
    mountHome();
    cy.get('[data-cy="start-higher"]').click();
    cy.get('[data-cy-path]').should("have.attr", "data-cy-path", "/game2");
    cy.get('[data-cy="game2"]').should("exist");
  });

  it("to /game3", () => {
    mountHome();
    cy.get('[data-cy="start-sort"]').click();
    cy.get('[data-cy-path]').should("have.attr", "data-cy-path", "/game3");
    cy.get('[data-cy="game3"]').should("exist");
  });
});
