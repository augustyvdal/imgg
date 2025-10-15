import { GuessingGameAPICall } from "../services/apiClient";

export class GuessTheMovieModel {
    movie: any = null;
    startingInfo: string[] = []
    clues: string[] = [];
    currentClueIndex = -1;
    totalScore: number = 0;
    gameOver = false;
    category: string = "";

    async startNewRound() {
        const movieData = await GuessingGameAPICall(this.category);
        this.movie = movieData;
        this.startingInfo = [
            `Release year: ${movieData.release_year}`,
            `Genres: ${movieData.genres}`,
        ];
        this.clues = [
            `Budget: $${(movieData.budget / 1_000_000).toFixed(1)} M`,
            `Revenue: $${(movieData.revenue / 1_000_000).toFixed(1)} M`,
            //`Keywords: ${movieData.keywords.join(", ")}`,
            `Director: ${movieData.director}`,
            `Actors: ${movieData.main_actors.join(", ")}`,
            `Plot: ${movieData.description.split(".")[0]}.`,
        ];

        this.currentClueIndex = -1;

        return this.getCurrentClues();
    }

    makeGuess(guess: string) {
        if (this.gameOver || !this.movie) return;

        const normalizedGuess = guess.trim().toLowerCase();
        const normalizedTitle = this.movie.title.toLowerCase();

        if (normalizedGuess === normalizedTitle) {
            const score = this.clues.length - this.currentClueIndex;
            this.totalScore += score;
            return {
                correct: true,
                score: this.totalScore
            };
        }

        this.currentClueIndex++;
        if (this.currentClueIndex >= this.clues.length) {
            this.gameOver = true;
            // Highscore, leaderboard etc.
            //this.totalScore = 0;
            return {
                correct: false,
                score: this.totalScore,
                lose: true
            };
        }
        return {
            correct: false,
            nextClue: this.getCurrentClues(),
            remaining: this.clues.length - this.currentClueIndex,
            score: this.totalScore
        };
    }
    chosenCategory(category: "movie" | "tv") {
        this.category = category;
    }
    getCurrentClues() {
        return this.clues.slice(0, this.currentClueIndex + 1);
    }
    restartGame() {
        this.totalScore = 0;
        this.gameOver = false;
        this.currentClueIndex = 0;
        this.movie = null;
    }
}
