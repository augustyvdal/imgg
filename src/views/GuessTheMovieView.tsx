import React from "react";
import "../styles/Guessthemovie.css";
import ChooseCategory from "../components/ChooseCategory";

type Props = {
    loading: boolean;
    clues: string[];
    message: string;
    category: string;
    score: number;
    gameOver: boolean;
    onGuess: (guess: string) => void;
    onRestart: () => void;
    chooseCategory: (category: "movie" | "tv") => void;
    startingInfo: string[];
    query: string;
    onQueryChange: (q: string) => void;
    searchResults: { id: number; image: string; title: string; year: string }[];
    onSelectSuggestion: (title: string) => void;
};

export default function GuessTheMovieView({loading, clues, message, category, score, gameOver, onGuess, onRestart, chooseCategory, startingInfo, query, onQueryChange, searchResults, onSelectSuggestion}: Props) {
    return (
        <div className="guess-container">
            <h1>Guess the Movie</h1>

            {category === "" && <ChooseCategory onSelect={chooseCategory} />}

            {category !== "" && (
                <>
                    {loading ? (
                        <p>Loading new movie...</p>
                    ) : (
                        <>
                            <div className="starting-info">
                                {startingInfo.map((info, i) => (
                                    <p key={i}>{info}</p>
                                ))}
                            </div>

                            <div className="clues">
                                {clues.map((clue, i) => (
                                    <p key={i}>
                                        <strong>Clue {i + 1}:</strong> {clue}
                                    </p>
                                ))}
                            </div>

                            {message && <p className="message">{message}</p>}

                            {!gameOver && (
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        onGuess(query);
                                        onQueryChange("");
                                    }}
                                    className="guess-form"
                                >
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={query}
                                            onChange={(e) => onQueryChange(e.target.value)}
                                            placeholder="Your guess..."
                                            autoComplete="off"
                                        />

                                        {searchResults.length > 0 && (
                                            <ul className="suggestions">
                                                {searchResults.map((s, i) => (
                                                    <li key={i} onClick={() => onSelectSuggestion(s.title)}>
                                                        {s.image ? (
                                                            <img
                                                                src={`https://image.tmdb.org/t/p/w92${s.image}`}
                                                                alt={s.title}
                                                            />
                                                        ) : (
                                                            <div style={{ width: "40px", height: "60px", background: "#ddd", borderRadius: "4px" }} />
                                                        )}
                                                        <div style={{ textAlign: "left" }}>
                                                            <div>{s.title}</div>
                                                            {s.year && <span className="year">({s.year})</span>}
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>

                                    <button type="submit">Guess</button>
                                </form>
                            )}

                            {gameOver && (
                                <div>
                                    <p>Final Score: {score}</p>
                                    <button onClick={onRestart}>Play Again</button>
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
}