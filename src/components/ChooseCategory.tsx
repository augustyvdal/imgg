
type Props = {
  onSelect: (category: "movie" | "tv") => void;
};

export default function ChooseCategory({ onSelect }: Props) {
  return (
    <div className="flex flex-col items-center space-y-6 p-40">
      <h2 className="text-black dark:text-white text-3xl font-bold">Choose a category to start</h2>
      <div className="flex gap-6">
        <button className="btn-default" onClick={() => onSelect("movie")}>Movies</button>
        <button className="btn-default" onClick={() => onSelect("tv")}>TV Shows</button>
      </div>
    </div>
  );
}
