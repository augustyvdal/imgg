// Handles API calls to IMDb (via RapidAPI).
// Exports functions like getMovieById, searchMovies, getPopularTitles.
const API_KEY = import.meta.env.TMDB_API_KEY;

const BASE_URL = "https://api.themoviedb.org/3";

export interface Movie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
}

export class TMDBService {
  // Fetch a random popular movie
  static async getRandomMovie(): Promise<Movie> {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`);
    if (!response.ok) throw new Error("Failed to fetch popular movies from TMDB");

    const data = await response.json();
    const movies: Movie[] = data.results.map((m: any) => ({
      id: m.id,
      title: m.title,
      overview: m.overview,
      release_date: m.release_date,
    }));

    const randomIndex = Math.floor(Math.random() * movies.length);
    return movies[randomIndex];
  }
}
