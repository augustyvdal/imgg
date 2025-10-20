/// <reference types="cypress" />

import React from "react";
import * as Router from "react-router-dom";
import ProfilePresenter from "../../src/presenters/ProfilePresenter";
import { AuthContext } from "../../src/contexts/AuthContext";

const makeInitialState = () => ({
  profile: {
    id: "u1",
    username: "August",
    avatar_url: null as string | null,
    updated_at: new Date().toISOString(),
  },
  avatarPublicUrl: null as string | null,
  loadingProfile: false,
  saving: false,
  uploading: false,
  error: null as string | null,
});

const makeFakeModel = () => {
  const createInitialState = cy.stub().callsFake(makeInitialState);

  const init = cy.stub().callsFake(async (state: any) => state);


  const setUsername = cy
    .stub()
    .callsFake(async (state: any, username: string | null) => ({
      ...state,
      saving: false,
      error: null,
      profile: state.profile ? { ...state.profile, username } : state.profile,
    }));


  const setAvatar = cy
    .stub()
    .callsFake(async (state: any, _file: File) => ({
      ...state,
      uploading: false,
      avatarPublicUrl: "blob://fake",
      error: null,
    }));

  return { createInitialState, init, setUsername, setAvatar };
};


function mountWithProviders(model: any, authValue: any) {
  cy.mount(
    <Router.MemoryRouter initialEntries={["/profile"]}>
      <AuthContext.Provider value={authValue}>
        <ProfilePresenter model={model} />
      </AuthContext.Provider>
    </Router.MemoryRouter>
  );
}


describe("ProfilePresenter (component)", () => {
  it("renders email, pre-fills username from model, and saves", () => {
    const authValue = { user: { email: "test@example.com" }, loading: false };
    const model = makeFakeModel();

    mountWithProviders(model, authValue);


    cy.get('input[disabled]').should("have.value", "test@example.com");

    cy.get('input[placeholder="Pick a username"]').should("have.value", "August");


    cy.get('input[placeholder="Pick a username"]').clear().type("NewName");
    cy.contains("button", /save changes/i).click();


    cy.wrap(model.setUsername).should("have.been.called");
    cy.wrap(model.setUsername).its("lastCall.args.1").should("equal", "NewName");
  });

  it("calls setAvatar when a file is selected", () => {
    const authValue = { user: { email: "file@example.com" }, loading: false };
    const model = makeFakeModel();

    mountWithProviders(model, authValue);

    const fileName = "avatar.png";
    cy.get('input[type="file"]').selectFile(
      {
        contents: Cypress.Buffer.from("fake image bytes"),
        fileName,
        mimeType: "image/png",
      },
      { force: true }
    );

    cy.wrap(model.setAvatar).should("have.been.called");
    cy.wrap(model.setAvatar)
      .its("firstCall.args.1")
      .should((arg) => {
        expect(arg).to.be.instanceOf(File);
        expect((arg as File).name).to.equal(fileName);
      });
  });

  it("navigates to /login when not authenticated", () => {
    const authValue = { user: null, loading: false };
    const model = makeFakeModel();

    function LocationProbe() {
      const loc = Router.useLocation();
      return <div data-cy-path={loc.pathname} />;
    }

    cy.mount(
      <Router.MemoryRouter initialEntries={["/profile"]}>
        <AuthContext.Provider value={authValue as any}>
          <Router.Routes>
            <Router.Route
              path="/profile"
              element={
                <>
                  <LocationProbe />
                  <ProfilePresenter model={model as any} />
                </>
              }
            />
            <Router.Route
              path="/login"
              element={
                <>
                  <LocationProbe />
                  <div data-cy="login-page">Login</div>
                </>
              }
            />
          </Router.Routes>
        </AuthContext.Provider>
      </Router.MemoryRouter>
    );

    cy.get("[data-cy-path]").should("have.attr", "data-cy-path", "/login");
    cy.get('[data-cy="login-page"]').should("exist");
  });
});
