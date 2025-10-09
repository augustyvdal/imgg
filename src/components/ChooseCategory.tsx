
type Props = {
  onSelect: (category: "movie" | "tv") => void;
};

export default function ChooseCategory({ onSelect }: Props) {
  return (
    <div className="choose-category" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
      <h2>Choose a category to start</h2>
      <button onClick={() => onSelect("movie")}>Movies</button>
      <button onClick={() => onSelect("tv")}>TV Shows</button>
    </div>
  );
}
