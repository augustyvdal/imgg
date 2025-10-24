import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import leaderboardRouter from "./routes/leaderboard.js";
import guessGameRouter from "./routes/guessGame.js";
import sortLeaderboardRouter from "./routes/sortLeaderboard.js"
import profileRouter from "./routes/profile.js"

const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(',').map(o => o.trim()),
    credentials: true
  }));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Backend is running!');
  });

app.get("/api/ping", (_, res) => res.json({ message: "Backend is running!" }));


app.use("/api/leaderboard", leaderboardRouter);
app.use("/api/guessGame", guessGameRouter);
app.use("/api/sortLeaderboard", sortLeaderboardRouter)
app.use("/api/profile", profileRouter)

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
