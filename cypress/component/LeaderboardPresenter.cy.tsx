/// <reference types="cypress" />

import React from "react";
import LeaderboardPresenter from "../../src/presenters/LeaderboardPresenter";

const hlRow = (id: string, username: string, score: number, category: string | null) => ({
  id,
  user_id: `u-${id}`,
  username,
  score,
  category,
  created_at: new Date().toISOString(),
});

const sortRow = (id: string, username: string, best_streak: number, category: string | null) => ({
  id,
  user_id: `u-${id}`,
  username,
  best_streak,
  category,
  created_at: new Date().toISOString(),
});

describe("LeaderboardPresenter (component)", () => {
  it("loads and renders both leaderboards on mount", () => {
    const loadHigherLower = cy.stub().resolves([
      hlRow("1", "August", 9, "movie"),
      hlRow("2", "Ludde", 6, "tv"),
    ]);
    const loadSort = cy.stub().resolves([
      sortRow("1", "Eric", 5, "movie"),
      sortRow("2", "Gustav", 3, "tv"),
    ]);

    cy.mount(
      <LeaderboardPresenter loadHigherLower={loadHigherLower} loadSort={loadSort} />
    );

    cy.wrap(loadHigherLower).should("have.been.calledWith", 20, undefined);
    cy.wrap(loadSort).should("have.been.calledWith", 20, undefined);

    cy.contains(/leaderboard/i).should("exist");
    cy.contains(/august/i).should("exist");
    cy.contains(/ludde/i).should("exist");
    cy.contains(/eric/i).should("exist");
    cy.contains(/gustav/i).should("exist");
  });

  it("changing category triggers reload with that category", () => {
    const loadHigherLower = cy.stub().resolves([]);
    const loadSort = cy.stub().resolves([]);

    cy.mount(
      <LeaderboardPresenter loadHigherLower={loadHigherLower} loadSort={loadSort} />
    );

    cy.get("select").select("movie");

    cy.wrap(loadHigherLower).should("have.been.calledWith", 20, "movie");
    cy.wrap(loadSort).should("have.been.calledWith", 20, "movie");
  });

  it("shows an error when a loader rejects", () => {
    const loadHigherLower = cy.stub().rejects(new Error("Boom"));
    const loadSort = cy.stub().resolves([]);

    cy.mount(
      <LeaderboardPresenter loadHigherLower={loadHigherLower} loadSort={loadSort} />
    );

    cy.contains(/boom|failed to load/i).should("be.visible");
  });

  it("reloads when clicking Refresh", () => {
    const loadHigherLower = cy.stub().resolves([]);
    const loadSort = cy.stub().resolves([]);

    cy.mount(
      <LeaderboardPresenter loadHigherLower={loadHigherLower} loadSort={loadSort} />
    );

    cy.contains(/refresh/i).click();

    cy.wrap(loadHigherLower).should("have.been.calledTwice");
    cy.wrap(loadSort).should("have.been.calledTwice");
  });
});
