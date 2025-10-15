import "/src/styles/Navbar.css"
import { useLocation, Link } from 'react-router-dom';
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

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
            <Link to="/leaderboard" className="nav-link" onClick={closeAll}>Leaderboard</Link>
            <Link to="/profile" className="nav-link" onClick={closeAll}>Profile</Link>
        </nav>
    );
}

const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const closeMobile = () => setMobileOpen(false);

    const { user, signOut } = useAuth() as any;
    const navigate = useNavigate();

    const handleLoginClick = () => {
        closeMobile();
        navigate("/login");
    }

    const handleLogoutClick = async () => {
        await signOut();
        closeMobile();
        navigate("/");
    }


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
            <div className="auth-buttons">
            {user ? (
                <button className="nav-link" onClick={handleLogoutClick}>
                    Sign out ({user.email})
                </button>
             ) : (
                <button className="nav-link" onClick={handleLoginClick}>
                    Login
                </button>
                )}
            </div>

            <div id="mobile-menu" className={`mobile-menu ${mobileOpen ? "open" : ""}`}>
                <Options isMobile closeAll={closeMobile} />
                <div className="mobile-cta">
                </div>
            </div>
        </header>
    );
}

export default Navbar;
