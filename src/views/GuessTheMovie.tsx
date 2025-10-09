import { useState } from "react";
import { useMovieGamePresenter } from "../presenters/GuessTheMoviePresenter";

export default function MovieGameView() {
    const { loading, clues, message, score, isOver, makeGuess, reset } =
        useMovieGamePresenter();

    const [guess, setGuess] = useState("");

    if (loading) return <p>Loading random movie…</p>;

    return (
        <div style={{ maxWidth: 600, margin: "40px auto", padding: 20 }}>
            <h1>Guess the Movie</h1>

            <div style={{ marginBottom: 16 }}>
                {clues.map((clue, i) => (
                    <p key={i}>
                        <strong>Clue {i + 1}:</strong> {clue}
                    </p>
                ))}
            </div>

            {!isOver && (
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        makeGuess(guess);
                        setGuess("");
                    }}
                >
                    <input
                        type="text"
                        value={guess}
                        onChange={(e) => setGuess(e.target.value)}
                        placeholder="Your guess…"
                        style={{
                            width: "100%",
                            padding: 8,
                            marginBottom: 8,
                            fontSize: 16,
                        }}
                    />
                    <button type="submit" style={{ padding: "8px 16px", fontSize: 16 }}>
                        Guess
                    </button>
                </form>
            )}

            {message && <p>{message}</p>}
            {isOver && <p>Final Score: {score}</p>}

            {isOver && (
                <button
                    onClick={reset}
                    style={{
                        marginTop: 16,
                        padding: "8px 16px",
                        fontSize: 16,
                        cursor: "pointer",
                    }}
                >
                    Play Again
                </button>
            )}
        </div>
    );
}
