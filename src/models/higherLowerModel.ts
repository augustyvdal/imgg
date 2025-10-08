// src/models/movieModel.ts
import { fetchFromTmdb } from "../services/apiClient";

export type Movie = {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
};

export class HigherLowerModel {
  movies: Movie[] = [];
  movieA: Movie | null = null;
  movieB: Movie | null = null;
  score: number = 0;

  // Fetch popular movies right now only page 1 just for testing purposes
  async fetchMovies() {
    //const randomPage = Math.floor(Math.random() * 38029) + 1;

    const data = await fetchFromTmdb(`/movie/popular?language=en-US&page=1`);

    this.movies = data.results.map((movie: any) => ({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
    }));

    // Gives movieA and movieB a movie with the attributes of the Movie type, takes and removes item from array
    this.movieA = this.movies.shift() || null;
    this.movieB = this.movies.shift() || null;
    this.score = 0;
  }

  // Returns boolean if guess is correct or not and adds score if correct
  makeGuess(guess: "higher" | "lower"): boolean {
    // Makes sure the movies are not null
    if (!this.movieA || !this.movieB) return false;

    const isHigher = this.movieB.vote_average > this.movieA.vote_average;
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

