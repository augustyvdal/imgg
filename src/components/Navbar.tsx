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
        <header className="bg-gray-50 dark:bg-gray-800 flex flex-row justify-between px-4 py-3 shadow-md">
            <div className="auth-buttons">
            {user ? (
                <button className="text-red-700 dark:text-red-400 cursor-pointer border rounded px-3 py-2" onClick={handleLogoutClick}>
                    Sign out ({user.email})
                </button>
             ) : (
                <button className="bg-blue-600 text-white rounded px-4 py-2 disabled:opacity-60" onClick={handleLoginClick}>
                    Login
                </button>
                )}
            </div>
            <div className="text-black dark:text-white text-xl flex flex-row justify-center font-sans">
                <Options isMobile closeAll={closeMobile} />
            </div>
        </header>
    );
}

export default Navbar;
