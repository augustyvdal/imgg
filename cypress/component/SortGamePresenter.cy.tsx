/// <reference types="cypress" />

import React from "react";
import SortGamePresenter from "../../src/presenters/SortGamePresenter";
import type { SortGameModel } from "../../src/models/SortGameModel";
import type { Content } from "../../src/services/apiClient";


const C = (id: number, title: string, vote: number): Content => ({
    id,
    title,
    name: title,
    poster_path: undefined,
    vote_average: vote,
});

class FakeSortModel {
    allContent: Content[] = [
        C(1, "Alpha", 8.0),
        C(2, "Bravo", 7.5),
        C(3, "Charlie", 7.0),
        C(4, "Delta", 6.8),
        C(5, "Echo", 6.5),
    ];

    sortCategory = "";
    maxTries = 3;
    triesRemaining = this.maxTries;
    roundStreak = 0;

    async GetAllContent(amount: number) {
        this.allContent = this.allContent.slice(0, amount);
    }

    returnAllContent(): Content[] {
        return this.allContent;
    }

    chooseSortCategory = cy.stub().callsFake((category: string) => {
        this.sortCategory = category;
    });

    reorderContent(fromIndex: number, toIndex: number) {
        const updated = [...this.allContent];
        const [moved] = updated.splice(fromIndex, 1);
        updated.splice(toIndex, 0, moved);
        this.allContent = updated;
    }

    checkOrderCorrect = cy.stub().returns(false);
    countCorrectPlaces = cy.stub().returns(0);

    decrementTriesRemaining = cy
        .stub()
        .callsFake(() => (this.triesRemaining = Math.max(0, this.triesRemaining - 1)));

    incrementRoundStreak = cy.stub().callsFake(() => {
        this.roundStreak += 1;
    });

    async newRound() {
        this.triesRemaining = this.maxTries;
        await this.GetAllContent(5);
    }

    resetSortGame() {
        this.triesRemaining = this.maxTries;
        this.allContent = [
            C(1, "Alpha", 8.0),
            C(2, "Bravo", 7.5),
            C(3, "Charlie", 7.0),
            C(4, "Delta", 6.8),
            C(5, "Echo", 6.5),
        ];
        this.sortCategory = "";
        this.roundStreak = 0;
    }
}

function pickCategory() {
    cy.contains("button", /movie|tv|series|popular|any/i).first().click({ force: true });
}
function clickSubmit() {
    cy.contains("button:not([disabled])", /submit|check|done|go|confirm/i)
        .first()
        .click({ force: true });
}
function clickNextRound() {
    cy.contains("button", /next round|next/i).first().click({ force: true });
}
function clickTryAgain() {
    cy.contains("button", /try again|reset|restart/i).first().click({ force: true });
}

describe("SortGamePresenter (component)", () => {
    it("starts a round after category select and shows items", () => {
        const model = new FakeSortModel();

        cy.spy(model, "GetAllContent").as("getAll");

        cy.mount(<SortGamePresenter model={model as unknown as SortGameModel} />);

        pickCategory();

        cy.get("@getAll").should("have.been.called");
        cy.contains(/Alpha|Bravo|Charlie/i).should("be.visible");
    });

    it("on correct submit shows CORRECT!!! and enables next round", () => {
        const model = new FakeSortModel();
        model.checkOrderCorrect.returns(true);

        cy.spy(model, "newRound").as("newRound");

        cy.mount(<SortGamePresenter model={model as unknown as SortGameModel} />);

        pickCategory();
        clickSubmit();

        cy.contains(/CORRECT!!!/i).should("be.visible");
        cy.wrap(model.incrementRoundStreak).should("have.been.called");

        cy.contains(/next round|next/i).should("exist");
        clickNextRound();

        cy.get("@newRound").should("have.been.called"); 
    });

    it("on wrong submit (tries remain) shows hint and decrements tries", () => {
        const model = new FakeSortModel();
        model.checkOrderCorrect.returns(false);
        model.triesRemaining = 3;
        model.countCorrectPlaces.returns(2);

        cy.mount(<SortGamePresenter model={model as unknown as SortGameModel} />);

        pickCategory();
        clickSubmit();

        cy.contains(/wrong order/i).should("be.visible");
        cy.wrap(model.decrementTriesRemaining).should("have.been.called");
    });

    it("on last try shows final message and offers reset", () => {
        const model = new FakeSortModel();
        model.checkOrderCorrect.returns(false);
        model.triesRemaining = 1;

        cy.spy(model, "resetSortGame").as("reset");

        cy.mount(<SortGamePresenter model={model as unknown as SortGameModel} />);

        pickCategory();
        clickSubmit();

        cy.contains(/last try/i).should("be.visible");
        cy.contains(/try again|reset|restart/i).should("exist");

        clickTryAgain();

        cy.get("@reset").should("have.been.called"); 
    });
});
