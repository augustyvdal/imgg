import {useState} from "react"

type SortGameViewProps = {
    movies: {id: number; title: string}[];
    onReorder: (fromIndex: number, toIndex: number) => void;
}

function SortGameView({ movies, onReorder}: SortGameViewProps) {
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    return (
        <div>
            {movies.map((movie) => (
                <div
                key={movie.id}
                className="w-32 h-48 border rounded-lg shadow-md p-2 flex flex-col items-center bg-white"
                >
                    <p className="text-center text-sm font-medium mt-2 truncate">
                        {movie.title}
                    </p>
                </div>
                ))
            }
        </div>
    )
}

export default SortGameView