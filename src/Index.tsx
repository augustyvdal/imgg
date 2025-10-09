// src/index.tsx
import React from "react";
import { createRoot } from "react-dom/client";
import { observer } from "mobx-react-lite";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { HigherLowerModel } from "./models/higherLowerModel";
import { SortGameModel } from "./models/SortGameModel";

import "./styles/Global.css";

const higherLowerModel = new HigherLowerModel();
const sortGameModel = new SortGameModel();


const ReactRoot = observer(() => {
  return (
    <BrowserRouter>
      <App
        higherLowerModel={higherLowerModel}
        sortGameModel={sortGameModel}
      />
    </BrowserRouter>
  );
});

createRoot(document.getElementById("root")!).render(<ReactRoot />);
