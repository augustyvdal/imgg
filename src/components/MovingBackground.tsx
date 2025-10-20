import Marquee from "react-fast-marquee";

export default function MovingBackground({ images, reverse }: { images: string[]; reverse?: boolean }) {
    return (
        <div className="h-full overflow-hidden backdrop-blur-[40px]">
            <Marquee
                speed={20}
                gradient={false}
                direction={reverse ? "right" : "left"}
            >
                {images.map((src, i) => (
                    <img
                        alt="scroller"
                        key={i}
                        src={src}
                        className="h-[33vh] w-auto object-cover"
                        draggable={false}
                    />
                ))}
            </Marquee>
        </div>
    );
}