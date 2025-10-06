import "/src/styles/Navbar.css"
import { useLocation, Link } from 'react-router-dom';
import { useEffect, useState } from "react";

function Options({ isMobile = false, closeAll }: { isMobile?: boolean; closeAll?: () => void }) {
    const location = useLocation();

    useEffect(() => {
        if (closeAll) closeAll();
    }, [location.pathname]);

    return (
        <nav className={`options ${isMobile ? "options-mobile" : ""}`}>
            <Link to="/" className="nav-link" onClick={closeAll}>Start</Link>
            <Link to="/game1" className="nav-link" onClick={closeAll}>Game 1</Link>
            <Link to="/game2" className="nav-link" onClick={closeAll}>Game 2</Link>
            <Link to="/game3" className="nav-link" onClick={closeAll}>Game 3</Link>
        </nav>
    );
}

const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);

    const closeMobile = () => setMobileOpen(false);

    return (
        <header className="navbar">
            <button
                className={`hamburger ${mobileOpen ? "is-active" : ""}`}
                aria-label="Öppna meny"
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
                onClick={() => setMobileOpen(v => !v)}
            >
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </button>

            <Options />


            <div id="mobile-menu" className={`mobile-menu ${mobileOpen ? "open" : ""}`}>
                <Options isMobile closeAll={closeMobile} />
                <div className="mobile-cta">
                </div>
            </div>
        </header>
    );
}

export default Navbar;
