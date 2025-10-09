import { GuessingGameAPICall } from "../services/apiClient";

export class MovieModel {
    movie: any = null;
    clues: string[] = [];
    currentClueIndex = 0;
    score: number | null = null;
    isOver = false;

    async startNewRound() {
        const movieData = await GuessingGameAPICall();
        this.movie = movieData;

        this.clues = [
            `Release year: ${movieData.release_year}`,
            `Genre(s): ${movieData.genres}`,
            `Director: ${movieData.director}`,
            `Main actor(s): ${movieData.main_actors.join(", ")}`,
            `Description: ${movieData.description.split(".")[0]}.`,
        ];

        this.currentClueIndex = 0;
        this.score = null;
        this.isOver = false;

        return this.getCurrentClues();
    }

    getCurrentClues() {
        return this.clues.slice(0, this.currentClueIndex + 1);
    }

    makeGuess(guess: string) {
        if (this.isOver || !this.movie) return;

        const normalizedGuess = guess.trim().toLowerCase();
        const normalizedTitle = this.movie.title.toLowerCase();

        if (normalizedGuess === normalizedTitle) {
            this.score = 5 - this.currentClueIndex;
            this.isOver = true;
            return { correct: true, score: this.score };
        } else {
            this.currentClueIndex++;
            if (this.currentClueIndex >= 5) {
                this.isOver = true;
                this.score = 0;
                return { correct: false, score: 0, lose: true };
            }
            return {
                correct: false,
                nextClue: this.getCurrentClues(),
                remaining: 5 - this.currentClueIndex,
            };
        }
    }
}
