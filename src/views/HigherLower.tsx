// src/views/HigherLower.tsx
// src/views/HigherLower.tsx
import { useEffect, useState, useRef } from "react";
import { HigherLowerPresenter } from "../presenters/HigherLowerPresenter";
import { Movie } from "../models/higherLowerModel";

export default function HigherLower() {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Keep presenter stable across renders
  const presenterRef = useRef<HigherLowerPresenter | null>(null);

  if (!presenterRef.current) {
    presenterRef.current = new HigherLowerPresenter({
      showLoading: () => setLoading(true),
      hideLoading: () => setLoading(false),
      showError: (err: Error) => setError(err.message),
      render: (movie: Movie) => setMovie(movie),
    });
  }

  useEffect(() => {
    presenterRef.current?.init();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!movie) return null;

  return (
    <div>
      <h1>Higher or Lower!</h1>
      <h2>{movie.title}</h2>
      <p>Rating: {movie.vote_average}</p>
      <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} />
      <button onClick={() => presenterRef.current?.nextMovie()}>Next Movie</button>
    </div>
  );
}