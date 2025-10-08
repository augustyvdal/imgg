// src/views/HigherLowerView.tsx
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { higherLowerPresenter } from "../presenters/HigherLowerPresenter";
import "../styles/Higherlower.css"

const HigherLower = observer(() => {
    const presenter = higherLowerPresenter;
    const [message, setMessage] = useState<string>("");
    // Boolean to show rating for movie B after guess
    const [showRatings, setShowRatings] = useState(false);
    // Boolean to disable buttons
    const [buttonsDisabled, setButtonsDisabled] = useState(false);

    // Make sure the two movies are loaded
    useEffect(() => {
        presenter.loadMovies();
    }, []);

    if (!presenter.hasMovies) {
        return <div>Loading movies...</div>;
    }

    // After user guesses both ratings are shown and buttons are disabled, either for 1.5 seconds if the answer is correct
    // otherwise it is game over and buttons stay disabled.
    const onGuess = async (guess: "higher" | "lower") => {
        if (buttonsDisabled) return;

        const correct = presenter.handleGuess(guess);
        setShowRatings(true);
        setButtonsDisabled(true);

        if (correct) {
        setMessage("Correct!");
        // Wait 1.5s, then advance
        setTimeout(() => {
            presenter.nextRound();
            setShowRatings(false);
            setButtonsDisabled(false);
            setMessage("");
        }, 1500);
        } else {
        setMessage("Wrong! Game Over.");
        }
    };

    return (
        <div className="game-container">
            <h1>Higher or Lower: Movie Ratings</h1>
            <h2>Score: {presenter.score}</h2>

            <div className="movies">
                <div className="movie">
                    <h3>{presenter.movieA?.title}</h3>
                    <img
                        src={`https://image.tmdb.org/t/p/w200${presenter.movieA?.poster_path}`}
                        alt={presenter.movieA?.title}
                    />
                    <p>Rating: {presenter.movieA?.vote_average}</p>
                </div>

                <div className="vs" style={{display: "flex", alignItems: "center", gap: "1rem"}}>
                    <h3>Is "{presenter.movieB?.title}" rated</h3>
                    <button onClick={() => onGuess("higher")} disabled={buttonsDisabled}>Higher</button>
                    <h3>OR</h3>
                    <button onClick={() => onGuess("lower")} disabled={buttonsDisabled}>Lower</button>
                    {message && <p>{message}</p>}
                </div>

                <div className="movie">
                    <h3>{presenter.movieB?.title}</h3>
                    <img
                        src={`https://image.tmdb.org/t/p/w200${presenter.movieB?.poster_path}`}
                        alt={presenter.movieB?.title}
                    />
                    <p>{showRatings ? `Rating: ${presenter.movieB?.vote_average}` : "Rating: ???"}</p>
                </div>
            </div>
        </div>
    );
});

export default HigherLower;
