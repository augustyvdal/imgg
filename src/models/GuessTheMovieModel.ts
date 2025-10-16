import { GuessingGameAPICall } from "../services/apiClient";

export class GuessTheMovieModel {
    title: any = null;
    startingInfo: string[] = []
    clues: string[] = [];
    currentClueIndex = -1;
    totalScore: number = 0;
    gameOver = false;
    category: string = "";

    async startNewRound() {
        const titleData = await GuessingGameAPICall(this.category);
        this.title = titleData;
        this.startingInfo = [
            `Release year: ${titleData.release_year}`,
            `Genre(s): ${titleData.genres}`,
            `TMDb Rating: ${titleData.tmdb_rating}`,
        ];
        this.clues = [
            `Director: ${titleData.director}`,
            `Main Actors: ${titleData.main_actors}`,
            `Characters: ${titleData.characters.join(", ")}`,
            `Plot: ${titleData.description.split(".")[0]}.`,
        ];

        this.currentClueIndex = -1;

        return this.getCurrentClues();
    }

    makeGuess(guess: string) {
        if (this.gameOver || !this.title) return;

        const normalizedGuess = guess.trim().toLowerCase();
        const normalizedTitle = this.title.title.toLowerCase();

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
        this.title = null;
    }
}
