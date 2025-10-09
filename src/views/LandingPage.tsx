import React from "react";
import { useMessageViewModel } from "../viewmodels/startPageViewModel";

export default function MessageView() {
  const { message } = useMessageViewModel();

  return (
    <div className="p-4 text-center">
      <h1 className="text-2xl font-bold mb-2">MVVM Example</h1>
      <p className="text-lg">{message}</p>
    </div>
  );
}
