import { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";

export default function MovingBackground({images, reverse = false,}: { images: string[]; reverse?: boolean; }) {
    const [posters, setPosters] = useState<string[]>([]);

    useEffect(() => {
        const update = () => {
            const posterWidth = window.innerHeight / 3 * (2 / 3);
            const count = Math.ceil(window.innerWidth / posterWidth) + 3;
            const repeated = Array.from({ length: count }, (_, i) => images[i % images.length]);
            setPosters(repeated);
        };
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, [images]);

    return (
        <div className="h-full overflow-hidden backdrop-blur-[40px]">
            <Marquee
                speed={20}
                gradient={false}
                direction={reverse ? "right" : "left"}
                autoFill={false}
            >
                {posters.map((src, i) => (
                    <img
                        alt="poster"
                        key={i}
                        src={src}
                        className="h-[33vh] w-auto object-cover flex-shrink-0 opacity-80"
                        draggable={false}
                    />
                ))}
            </Marquee>
        </div>
    );
}