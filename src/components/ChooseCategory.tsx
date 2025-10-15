
type Props = {
  onSelect: (category: "movie" | "tv") => void;
};

export default function ChooseCategory({ onSelect }: Props) {
  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <h2 className="text-black dark:text-white text-lg font-semibold">Choose a category to start</h2>
      <div className="flex gap-1">
        <button onClick={() => onSelect("movie")}>Movies</button>
        <button onClick={() => onSelect("tv")}>TV Shows</button>
      </div>
    </div>
  );
}
