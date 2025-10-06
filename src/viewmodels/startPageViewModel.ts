import { useState, useEffect } from "react";
import { GeneralModel } from "../models/GeneralModel";

export function useMessageViewModel() {
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const msg = GeneralModel.getMessage();
    setMessage(msg);
  }, []);

  return { message };
}