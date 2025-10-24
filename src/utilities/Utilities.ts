import { useEffect, useState } from "react";

function Debounce<T>(value: T, delay: number): T {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);

    return debounced;
}

function getRandomNumber(max: number): number {
    return (Math.floor(Math.random() * max) + 1);
}

export { Debounce, getRandomNumber };