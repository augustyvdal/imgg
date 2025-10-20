import { motion } from "framer-motion";
import MovingBackground from "../components/MovingBackground";

type Props = {
  onStartGuessTheMovie: () => void;
  onStartHigherLower: () => void;
  onStartSortGame: () => void;
};

export default function HomeView({ onStartGuessTheMovie, onStartHigherLower, onStartSortGame }: Props) {
    return (
        <div className="relative min-h-screen overflow-hidden text-[var(--color-col4)] bg-[var(--color-col4)]/70 font-sans">
            <div className="absolute inset-0 grid grid-rows-3 gap-0">
                <MovingBackground
                    images={["/star.jpg", "/star.jpg", "/star.jpg"]}
                    reverse={false}
                />
                <MovingBackground
                    images={["/img.jpg", "/img.jpg", "/img.jpg", "/img.jpg"]}
                    reverse={true}
                />
                <MovingBackground
                    images={["/img.jpg", "/img.jpg", "/img.jpg", "/img.jpg"]}
                    reverse={false}
                />
            </div>

            <div className="absolute inset-y-0 left-0 w-[60%] bg-gradient-to-r from-[var(--color-col3)] via-[var(--color-col3)]/50 to-[var(--color-col3)]/10 backdrop-blur-[2px]" />

            <div className="relative z-10 flex flex-row h-full">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute bottom-16 left-12 md:left-20"
                >
                    <h1 className="text-7xl md:text-8xl font-extrabold tracking-tight drop-shadow-2xl">
                        IMGG
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-200 mt-2 font-medium">
                        Internet's Movie Guessing Games!
                    </p>
                </motion.div>

                <div className="ml-auto flex items-end justify-center w-full md:w-[40%] bg-[var(--color-col3)] backdrop-blur-[40px] shadow-2xl h-screen">
                    <div className="flex flex-col w-full text-center">
                        <h1 className="text-5xl font-semibold mb-20">Game Hub</h1>
                        <div className="flex flex-col w-full gap-1">
                            {[
                                { label: "Guess the Movie", onClick: onStartGuessTheMovie },
                                { label: "Higher / Lower", onClick: onStartHigherLower },
                                { label: "Sort Game", onClick: onStartSortGame },
                            ].map(({ label, onClick }, i) => (
                                <div
                                    key={i}
                                    onClick={onClick}
                                    className="group relative cursor-pointer overflow-hidden p-10 flex items-center justify-between
                                            transition-all duration-500 ease-out
                                            bg-gradient-to-r from-[var(--color-col2)] via-[var(--color-col2)]/50 to-transparent
                                            hover:from-[var(--color-col1)]/80"
                                    >
                                    <span className="text-xl font-semibold transition-transform duration-500 group-hover:translate-x-3">
                                    {label}
                                    </span>
                                    <span
                                        className="text-2xl opacity-0 translate-x-[-10px] transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0">➜
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


