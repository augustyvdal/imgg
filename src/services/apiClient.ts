// Handles API calls to IMDb (via RapidAPI).
// Exports functions like getMovieById, searchMovies, getPopularTitles.
import { getRandomNumber } from "../utilities/RandomNumber";
const BASE_URL = "https://api.themoviedb.org/3";
const TOKEN = import.meta.env.VITE_TMDB_READACCESS_TOKEN;
const randomPage = Math.floor(Math.random() * 100) + 1;

export type Content = {
  id: number;
  title?: string;
  name?: string;
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
export async function fetchHigherLower(category: string): Promise<Content[]> {
  const today = new Date().toISOString().split("T")[0];
  const randomPage = getRandomNumber(500);
  const data =  await fetchFromTmdb(`/discover/${category}?language=en-US&sort_by=popularity.desc&release_date.lte=${today}&page=${randomPage}`);

  return data.results.map((content: any) => ({
    id: content.id,
    title: content.title,
    name: content.name,
    poster_path: content.poster_path,
    vote_average: content.vote_average,
  }));
}

export async function GetContentForSort(amountOfResults: number, category: string): Promise<Content[]> {
  const page: number = getRandomNumber(500);
  try {
    const url =
      BASE_URL +
      `/discover/${category}?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc`;

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data.results)) {
      throw new Error("Unexpected API response format");
    }

    return data.results.slice(0, amountOfResults).map((content: any) => ({
      id: content.id,
      title: content.title,
      vote_average: content.vote_average,
      name: content.name
    }));
  } catch (err) {
    console.error("Error fetching content:", err);
    return [];
  }
}


export async function GuessingGameAPICall() {
    const data = await fetchFromTmdb(`/movie/popular?page=${randomPage}`);
    const randomMovie = data.results[Math.floor(Math.random() * data.results.length)];

    const details = await fetchFromTmdb(`/movie/${randomMovie.id}?append_to_response=credits`);
    const director = details.credits.crew.find((c: any) => c.job === "Director")?.name;
    const main_actors = details.credits.cast.slice(0, 3).map((a: any) => a.name);
    const genres = details.genres.map((g: any) => g.name).join(", ");
    const release_year = details.release_date?.split("-")[0];

    return {
        id: details.id,
        title: details.title,
        image: details.poster_path,
        release_year,
        director,
        main_actors,
        genres,
        description: details.overview,
    };
}