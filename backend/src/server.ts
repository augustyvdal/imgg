import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import leaderboardRouter from "./routes/leaderboard.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/ping", (_, res) => res.json({ message: "Backend is running!" }));


app.use("/api/leaderboard", leaderboardRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
