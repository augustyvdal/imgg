// Handles API calls to IMDb (via RapidAPI).
// Exports functions like getMovieById, searchMovies, getPopularTitles.
const BASE_URL = "https://api.themoviedb.org/3";
const TOKEN = import.meta.env.VITE_TMDB_READACCESS_TOKEN;

export type Movie = {
  id: number;
  title: string;
  poster_path?: string;
  vote_average?: number;
};

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${TOKEN}`
  }
}

export async function fetchFromTmdb(endpoint: string) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error(`TMDB fetch failed: ${response.status}`);
  }

  return response.json();
}

// Fetches movies for higher lower game
export async function fetchHigherLower(page: number): Promise<Movie[]> {
  const data = await fetchFromTmdb(`/movie/popular?language=en-US&page=${page}`);

  return data.results.map((movie: any) => ({
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    vote_average: movie.vote_average,
  }));
}

/*
export function GetMoviesForSort(amount: number): Promise<Movie[]> {
  const url = BASE_URL + `/discover/movie?include_adult=false&include_video=false&language=en-US&page=${amount}&sort_by=popularity.desc`
  return fetch(url, options)
  .then(response => response.json())
  .then(response => response.results.slice(0,amount)
  .map((movie: any) => ( {id: movie.id, title: movie.original_title} )))
  .catch((err: any) => console.log(err))
}
*/

export async function GetMoviesForSort(amount: number): Promise<Movie[]> {
  try {
    const url =
      BASE_URL +
      `/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc`;

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data.results)) {
      throw new Error("Unexpected API response format");
    }

    return data.results.slice(0, amount).map((movie: any) => ({
      id: movie.id,
      title: movie.original_title,
    }));
  } catch (err) {
    console.error("Error fetching movies:", err);
    return [];
  }
}


