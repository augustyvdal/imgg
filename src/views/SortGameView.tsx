import { Content } from "../services/apiClient";

type SortGameViewProps = {
    content: Content[];
    onReorder: (fromIndex: number, toIndex: number) => void;
    onSubmit: () => void;
    feedback: string | null;
}

function SortGameView({ content, onReorder, onSubmit, feedback }: SortGameViewProps) {

    return (
        <div className="flex flex-col items-center gap-4">
            <ul className="flex flex-col gap-2 p-0 list-none">
                {content.map((item, index) => (
                    <li
                    key={item.id}
                    className="w-32 h-48 border rounded-lg shadow-md p-2 flex flex-col items-center bg-white"
                    draggable
                    onDragStart={(e) =>
                        e.dataTransfer.setData("fromIndex", index.toString())
                    }
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                        const fromIndex = parseInt(e.dataTransfer.getData("fromIndex"));
                        onReorder(fromIndex, index);
                    }}
                    >
                        <p className="text-center text-sm font-medium mt-2 truncate">
                            {item.title}
                        </p>
                    </li>
                    ))
                }
            </ul>

            <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={onSubmit}
            >
                Submit
            </button>

            {feedback && <p className="mt-2 text-lg">{feedback}</p>}
        </div>
    );
}

export default SortGameView