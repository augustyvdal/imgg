// src/models/movieModel.ts
import { fetchFromTmdb } from "../services/apiClient";

export type Movie = {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
};

//Right now fetches popular movies and only page 1. Gives id, title, poster, rating. 
//Can add things later for variations of the game.
export const higherLowerModel = {
  async getPopularMovies(): Promise<Movie[]> {
    const data = await fetchFromTmdb("/movie/popular?language=en-US&page=1");
    return data.results.map((movie: any) => ({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
    }));
  },
};
