// src/models/movieModel.ts
import { fetchHigherLower, Movie } from "../services/apiClient";


export class HigherLowerModel {
  movies: Movie[] = [];
  movieA: Movie | null = null;
  movieB: Movie | null = null;
  score: number = 0;

  // Calls fetchHigherLower from apiClient and sets movies, movieA, movieB and score
  async fetchMovies() {
    const randomPage = Math.floor(Math.random() * 100) + 1;

    const movies = await fetchHigherLower(randomPage);

    // Sets movies attribute to the fetched movies
    this.movies = movies;

    // Shuffle movies
    this.movies.sort(() => Math.random() - 0.5);

    // Gives movieA and movieB a movie with the attributes of the Movie type, takes and removes item from array
    this.movieA = this.movies.shift() || null;
    this.movieB = this.movies.shift() || null;
    this.score = 0;
  }

  // Returns boolean if guess is correct or not and adds score if correct
  makeGuess(guess: "higher" | "lower"): boolean {
    // Makes sure the movies are not null
    if (!this.movieA || !this.movieB) return false;

    const isHigher = (this.movieB?.vote_average || 0) > (this.movieA?.vote_average || 0);
    const correct = (guess === "higher" && isHigher) || (guess === "lower" && !isHigher);

    if (correct) {
      this.score++;
    }

    return correct;
  }

  // When a new round is starting, movieB becomes movieA and a new movieB is drawn from the list 
  nextRound() {
    if (!this.movieB) return;
    this.movieA = this.movieB;
    this.movieB = this.movies.shift() || null;
  }

  // Add reset game function

};

