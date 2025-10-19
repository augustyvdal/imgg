/// <reference types="cypress" />

import React from "react";
import LoginPresenter from "../../src/presenters/LoginPresenter";
import { AuthContext } from "../../src/contexts/AuthContext";
import * as Router from "react-router-dom";

function LocationProbe() {
  const loc = Router.useLocation();
  return <div data-cy-path={loc.pathname} />;
}

function mountWithAuth(
  ui: React.ReactNode,
  authValue: Partial<React.ContextType<typeof AuthContext>> = {},
  initialPath = "/login"
) {
  cy.mount(
    <Router.MemoryRouter initialEntries={[initialPath]}>
      <AuthContext.Provider
        value={{
          user: null,
          loading: false,
          signIn: cy.stub().as("signIn"),
          signUp: cy.stub().as("signUp"),
          signOut: cy.stub().as("signOut"),
          ...(authValue as any),
        }}
      >
        <Router.Routes>
          <Router.Route
            path="/login"
            element={
              <>
                <LocationProbe />
                {ui}
              </>
            }
          />
          <Router.Route
            path="/"
            element={
              <>
                <LocationProbe />
                <div data-cy="home">Home</div>
              </>
            }
          />
        </Router.Routes>
      </AuthContext.Provider>
    </Router.MemoryRouter>
  );
}

describe("LoginPresenter (component)", () => {
  it("logs in successfully, shows toast, and redirects after 1300ms", () => {
    cy.clock();

    const signIn = cy.stub().resolves();
    cy.wrap(signIn).as("signIn");
    mountWithAuth(<LoginPresenter />, { signIn }, "/login");

    cy.get('[data-cy-path]').should("have.attr", "data-cy-path", "/login");

    cy.get('input[placeholder="email"]').type("user@example.com");
    cy.get('input[placeholder="password"]').type("secret");

    cy.contains("button", /sign in/i).click();

    cy.get("@signIn").should("have.been.calledWith", "user@example.com", "secret");

    cy.contains(/you are now logged in/i).should("be.visible");

    cy.tick(1300);
    cy.get('[data-cy-path]').should("have.attr", "data-cy-path", "/");
    cy.get('[data-cy="home"]').should("exist");
  });

  it("creates account via signUp and shows confirmation message", () => {
    const signUp = cy.stub().resolves();
    cy.wrap(signUp).as("signUp");
    mountWithAuth(<LoginPresenter />, { signUp }, "/login");

    cy.get('input[placeholder="email"]').type("new@user.com");
    cy.get('input[placeholder="password"]').type("pw123456");

    cy.contains("button", /create account/i).click();

    cy.get("@signUp").should("have.been.calledWith", "new@user.com", "pw123456");
    cy.contains(/check your email for a confirmation link/i).should("be.visible");
    cy.get('[data-cy-path]').should("have.attr", "data-cy-path", "/login");
  });

  it("shows error and does not redirect on failed login", () => {
    const signIn = cy.stub().rejects(new Error("Invalid credentials"));
    cy.wrap(signIn).as("signIn");
    mountWithAuth(<LoginPresenter />, { signIn }, "/login");

    cy.get('input[placeholder="email"]').type("bad@user.com");
    cy.get('input[placeholder="password"]').type("wrong");
    cy.contains("button", /sign in/i).click();

    cy.contains(/invalid credentials/i).should("be.visible");
    cy.get('[data-cy-path]').should("have.attr", "data-cy-path", "/login");
  });
});
