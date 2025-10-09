// Handles API calls to IMDb (via RapidAPI).
// Exports functions like getMovieById, searchMovies, getPopularTitles.
const BASE_URL = "https://api.themoviedb.org/3";
const TOKEN = import.meta.env.VITE_TMDB_READACCESS_TOKEN;
const randomPage = Math.floor(Math.random() * 100) + 1;


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