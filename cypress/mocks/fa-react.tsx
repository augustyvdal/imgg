// cypress/mocks/fa-react.tsx
import React from "react";

// Simple stand-in that won’t touch the DOM
export const FontAwesomeIcon = (props: any) => (
  <i data-fa-mock {...props} />
);

export default FontAwesomeIcon;
