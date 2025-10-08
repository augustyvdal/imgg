import { GetMoviesForSort, Movie } from "../services/apiClient";

export class SortGameModel {
    allMovies: Movie[] = [];

    async GetAllMovies(amount: number): Promise<Movie[]> {
        const movies = await GetMoviesForSort(amount);
        this.allMovies = movies;
        return movies;
    }

    getAllMovies(): Movie[] {
        return this.allMovies;
    }
}