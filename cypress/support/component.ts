import { mount } from "cypress/react";
import "@testing-library/cypress/add-commands";

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}
Cypress.Commands.add("mount", mount);
