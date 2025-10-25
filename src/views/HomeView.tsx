import { motion } from "framer-motion";
import MovingBackground from "../components/MovingBackground";
import poster1 from "/assets/images/poster1.jpg";
import poster2 from "/assets/images/poster2.webp";
import poster3 from "/assets/images/poster3.png";
import poster4 from "/assets/images/poster4.jpg";
import poster5 from "/assets/images/poster5.webp";
import poster6 from "/assets/images/poster6.jpg";
import logo from "/assets/images/logo_solid_bg.png";

type Props = {
    onStartGuessTheMovie: () => void;
    onStartHigherLower: () => void;
    onStartSortGame: () => void;
};

export default function HomeView({ onStartGuessTheMovie, onStartHigherLower, onStartSortGame }: Props) {
    return (
        <div className="relative min-h-screen overflow-hidden text-col4 bg-col6/70 font-sans">
            <div className="absolute inset-0 grid grid-rows-3 gap-0">
                <MovingBackground
                    images={[poster1, poster2, poster6, poster5]}
                    reverse={false}
                />
                <MovingBackground
                    images={[poster6, poster3, poster4, poster5]}
                    reverse={true}
                />
                <MovingBackground
                    images={[poster2, poster1, poster3, poster4]}
                    reverse={false}
                />
            </div>

            <div className="absolute inset-y-0 left-0 w-[60%] bg-gradient-to-r from-col4 via-col4/30 to-col4/10 dark:from-col6/70 dark:via-col6/50 dark:to-col6/10 backdrop-blur-[00px]" />

            <div className="relative z-10 flex flex-row h-full">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute bottom-16 left-12 md:left-20"
                >
                    <h1 className="text-col3 dark:text-col4 text-7xl md:text-8xl font-extrabold tracking-tight drop-shadow-2xl">
                        IMGG
                    </h1>
                    <p className="text-xl md:text-2xl text-col3 dark:text-col4 mt-2 font-medium">
                        Internet Movie Guessing Games!
                    </p>
                </motion.div>

                <div className="ml-auto flex flex-col items-center justify-between w-full md:w-[40%] bg-col4/70 dark:bg-col3/80 backdrop-blur-[20px] shadow-2xl h-screen">
                    <div className="flex flex-col items-center text-center w-full gap-6 mt-20">
                        <motion.img
                            src={logo}
                            alt="IMGG Logo"
                            className="w-40 h-40 object-contain mb-4 drop-shadow-lg"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                    </div>

                    <div className="flex flex-col w-full text-center">
                        <h1 className="text-5xl font-semibold mb-20 text-col3 dark:text-col4"></h1>
                        <div className="flex flex-col w-full gap-1">
                            {[
                                { label: "Guess the Movie", onClick: onStartGuessTheMovie },
                                { label: "Higher / Lower", onClick: onStartHigherLower },
                                { label: "Sort Game", onClick: onStartSortGame },
                            ].map(({ label, onClick }, i) => (
                                <div key={i} onClick={onClick} className="group relative cursor-pointer overflow-hidden p-10 flex items-center justify-between transition-all duration-500 ease-out bg-gradient-to-r hover:from-col1/80" >
                                    <span className="text-xl text-col3 dark:text-col4 font-semibold transition-transform duration-500 group-hover:translate-x-3">
                                        {label}
                                    </span>
                                    <span className="text-2xl text-col3 dark:text-col4 opacity-100 translate-x-[-10px] transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0">
                                        ➜
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


