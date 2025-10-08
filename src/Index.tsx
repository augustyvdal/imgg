// src/index.tsx
import React from "react";
import { createRoot } from "react-dom/client";
import { observer } from "mobx-react-lite";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { HigherLowerModel } from "./models/higherLowerModel";

import "./styles/Global.css";

const higherLowerModel = new HigherLowerModel();

const ReactRoot = observer(() => {
  return (
    <BrowserRouter>
      <AppRoutes
        higherLowerModel={higherLowerModel}
      />
    </BrowserRouter>
  );
});

createRoot(document.getElementById("root")!).render(<ReactRoot />);
