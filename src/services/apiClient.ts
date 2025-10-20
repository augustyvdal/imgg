// Handles API calls to IMDb (via RapidAPI).
// Exports functions like getMovieById, searchMovies, getPopularTitles.
import { random } from "cypress/types/lodash";
import { getRandomNumber } from "../utilities/RandomNumber";
const BASE_URL = "https://api.themoviedb.org/3";
const TOKEN = import.meta.env.VITE_TMDB_READACCESS_TOKEN;

const MAX_PAGES = 100;
const MAX_TRIES = 50;

export type Content = {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
  vote_average?: number;
  year?: string;
};

const buildUrl = (category: string, page: number, today: string, minVot: number) =>
  `${BASE_URL}/discover/${category}?include_adult=false&include_video=false&language=en-US&release_date.lte=${today}&page=${page}&sort_by=popularity.desc&vote_count.gte=${minVot}`;


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

export async function fetchFromTmdbSafe(url: string) {
  const response = await fetch(url, {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error(`TMDB fetch failed: ${response.status}`);
  }

  // Defensive: TMDB sometimes returns empty or invalid bodies
  const json = await response.json();
  if (!json) {
    throw new Error("TMDB response body was empty/json failed");
  }

  return json;
}

const filterTheResults = (data: any): Content[] =>
  (Array.isArray(data.results) ? data.results : []).map((content: any) => ({
    id: content.id,
    title: content.title,
    name: content.name,
    poster_path: content.poster_path,
    vote_average: content.vote_average,
    year: content.first_air_date
        ? content.first_air_date.split("-")[0]
        : content.release_date
        ? content.release_date.split("-")[0]
        : "Year N/A", 
  }));


// Fetches movies for higher lower game
export async function fetchHigherLower(category: string): Promise<Content[]> {
  const today = new Date().toISOString().split("T")[0];
  const randomPage = getRandomNumber(500);
  const data =  await fetchFromTmdb(`/discover/${category}?include_adult=false&language=en-US&sort_by=popularity.desc&release_date.lte=${today}&page=${randomPage}`);

  // Filter out items without poster or vote_average of 0
  return data.results.filter((content: any) => content.poster_path && content.vote_average > 0 && !content.adult).map((content: any) => ({
    id: content.id,
    title: content.title,
    name: content.name,
    poster_path: content.poster_path,
    vote_average: content.vote_average,
  }));
}


export async function GetContentForSort(
  amountOfResults: number, 
  category: string,
  minVotes: number = 1500,
  today: string = new Date().toISOString().split("T")[0],
  usedPages: ReadonlySet<number> = new Set(),
  results: Content[] = []
): Promise<Content[]> {

  //stop if we have enough, or too many tries
  if (results.length >= amountOfResults || usedPages.size >= MAX_TRIES) {
    return results.slice(0, amountOfResults);
  }

  const remainingPages = Array.from({length: MAX_PAGES }, (_,i) => i + 1).filter(
    (pg) => !usedPages.has(pg)
  );

  const randomPage = remainingPages[Math.floor(Math.random() * remainingPages.length)];
  const url = buildUrl(category, randomPage, today, minVotes);
  const newUsedPages = new Set([...usedPages, randomPage])

  try {
    const response = await fetchFromTmdbSafe(url);

    const mappedAndFilteredRes = filterTheResults(response);

    return GetContentForSort (amountOfResults, category, minVotes, today, newUsedPages, [...results, ...mappedAndFilteredRes]); //recurse for all results

  } catch (err) {
    console.error("Error fetching content for sort:", err);
    return [];
  }
}

export async function GuessingGameAPICall(category: string) {
    const today = new Date().toISOString().split("T")[0];
    const randomPage = getRandomNumber(500);

    const data = await fetchFromTmdb(`/discover/${category}?include_adult=false?language=en-US&sort_by=popularity.desc&release_date.lte=${today}&page=${randomPage}`);

    const filteredResults = data.results.filter((content: any) => content.poster_path && content.vote_average > 0);

    const randomTitle = filteredResults[Math.floor(Math.random() * filteredResults.length)];


    const details = await fetchFromTmdb(`/${category}/${randomTitle.id}?append_to_response=credits`);

    const directorOrCreator = category === "movie" ? details.credits?.crew.find((c: any) => c.job === "Director")?.name || "Unknown" : details.created_by?.[0]?.name || "Unknown";

    const main_actors = details.credits?.cast?.slice(0, 3).map((a: any) => a.name).join(", ") || "Unknown";

    const genres = (details.genres || []).map((g: any) => g.name).join(", ") || "Unknown";

    const tmdb_rating = details.vote_average && details.vote_count > 0 ? `${details.vote_average.toFixed(1)}/10` : "Not rated";

    const characters = details.credits?.cast?.slice(0, 3).map((a: any) => a.character || "Unknown") || [];

    const release_year = category === "movie" ? details.release_date?.split("-")[0] || "Unknown" : (() => {
                const first = details.first_air_date?.split("-")[0];
                const last = details.last_air_date?.split("-")[0];
                return first ? `${first}${last && last !== first ? `–${last}` : ""}` : "Unknown";
        })();


    return {
        id: details.id,
        title: details.title || details.name || "Unknown Title",
        release_year,
        director: directorOrCreator,
        main_actors,
        genres,
        description: details.overview || "No description available.",
        tmdb_rating,
        characters
    };
}

export async function searchTitles(query: string, category: "movie" | "tv") {
    if (!query.trim()) return [];
    const data = await fetchFromTmdb(
        `/search/${category}?query=${encodeURIComponent(query)}&language=en-US&page=1`
    );
    return data.results.map((r: any) => ({
        id: r.id,
        title: category === "movie" ? r.title : r.name,
        image: r.poster_path,
    }));
}
