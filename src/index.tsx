// src/index.tsx
import './setupFetch';
import React from "react";
import { createRoot } from "react-dom/client";
import { observer } from "mobx-react-lite";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

import "./styles/Global.css";


const ReactRoot = observer(() => {
  return (
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  );
});

createRoot(document.getElementById("root")!).render(<ReactRoot />);
