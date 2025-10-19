/// <reference types="cypress" />

import React from "react";
import ProfilePresenter from "../../src/presenters/ProfilePresenter";
import { AuthContext } from "../../src/contexts/AuthContext";
import { ProfileModelCtx } from "../../src/contexts/ProfileModelContext";
import type { Profile } from "../../src/services/profileService";
import * as Router from "react-router-dom";

class FakeProfileModel {
  profile: Profile | null = { id: "u1", username: "August", avatar_url: null, updated_at: new Date().toISOString() };
  avatarPublicUrl: string | null = null;
  saving = false;
  uploading = false;
  error: string | null = null;

  setUsername = cy.stub().resolves();
  setAvatar = cy.stub().resolves();
}


function mountWithProviders(ui: React.ReactNode, {
  authValue,
  profileModel,
}: {
  authValue: any,
  profileModel: FakeProfileModel
}) {
  cy.mount(
    <Router.MemoryRouter initialEntries={["/profile"]}>
      <AuthContext.Provider value={authValue}>
        <ProfileModelCtx.Provider value={profileModel as any}>
          {ui}
        </ProfileModelCtx.Provider>
      </AuthContext.Provider>
    </Router.MemoryRouter>
  );
}

describe("ProfilePresenter (component)", () => {
  it("renders email, pre-fills username from model, and saves", () => {
    const authValue = {
      user: { email: "test@example.com" },
      loading: false,
    };
    const model = new FakeProfileModel();

    mountWithProviders(<ProfilePresenter />, { authValue, profileModel: model });

    cy.get('input[disabled]').should('have.value', "test@example.com");

    cy.get('input[placeholder="Pick a username"]').should('have.value', "August");

    cy.get('input[placeholder="Pick a username"]').clear().type("NewName");
    cy.contains("button", /save changes/i).click();

    cy.wrap(model.setUsername).should('have.been.calledWith', "NewName");
  });

  it("calls setAvatar when a file is selected", () => {
    const authValue = { user: { email: "file@example.com" }, loading: false };
    const model = new FakeProfileModel();

    mountWithProviders(<ProfilePresenter />, { authValue, profileModel: model });

    const fileName = "avatar.png";
    cy.get('input[type="file"]').selectFile(
      {
        contents: Cypress.Buffer.from("fake image bytes"),
        fileName,
        mimeType: "image/png"
      },
      { force: true }
    );

    cy.wrap(model.setAvatar).should('have.been.called');
    cy.wrap(model.setAvatar).its('firstCall.args.0').should((arg) => {
      expect(arg).to.be.instanceOf(File);
      expect((arg as File).name).to.equal(fileName);
    });
  });

function LocationProbe() {
  const loc = Router.useLocation();
  return <div data-cy-path={loc.pathname} />;
}

it("navigates to /login when not authenticated", () => {
  const authValue = { user: null, loading: false };
  const model = new FakeProfileModel();

  cy.mount(
    <Router.MemoryRouter initialEntries={["/profile"]}>
      <AuthContext.Provider value={authValue as any}>
        <ProfileModelCtx.Provider value={model as any}>

          {/* Define routes so navigation has somewhere to go */}
          <Router.Routes>
            <Router.Route
              path="/profile"
              element={
                <>
                  <LocationProbe />
                  <ProfilePresenter />
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

        </ProfileModelCtx.Provider>
      </AuthContext.Provider>
    </Router.MemoryRouter>
  );

  // Assert that the presenter redirected us to /login
  cy.get('[data-cy-path]').should('have.attr', 'data-cy-path', '/login');
  cy.get('[data-cy="login-page"]').should('exist');
});
});
