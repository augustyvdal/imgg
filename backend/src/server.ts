import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import leaderboardRouter from "./routes/leaderboard.js";
import guessGameRouter from "./routes/guessGame.js";
import sortLeaderboardRouter from "./routes/sortLeaderboard.js"

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/ping", (_, res) => res.json({ message: "Backend is running!" }));


app.use("/api/leaderboard", leaderboardRouter);
app.use("/api/guessGame", guessGameRouter);
app.use("/api/sortLeaderboard", sortLeaderboardRouter)

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
