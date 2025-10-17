import { useLocation, Link } from 'react-router-dom';
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";

function Options({ isMobile = false, closeAll }: { isMobile?: boolean; closeAll?: () => void }) {
    const location = useLocation();

    useEffect(() => {
        if (closeAll) closeAll();
    }, [location.pathname]);

    const linkClass = (path: string) =>
        `nav-link ${
            location.pathname === path
                ? "underline opacity-100" // active
                : "opacity-80 hover:opacity-50" // inactive
        }`;

    return (
        <nav className={"flex flex-row gap-10 items-center"}>
            <Link to="/leaderboard" className={`text-2xl font-bold text-black dark:text-white ${linkClass("/leaderboard")}`} onClick={closeAll}>Leaderboards</Link>
            <Link to="/profile" className={`text-2xl font-bold text-black dark:text-white ${linkClass("/profile")}`} onClick={closeAll}>Profile</Link>
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
        <header className="bg-gray-50 dark:bg-gray-800 flex flex-row px-4 py-3 shadow-md">
            <div className="flex-1">
                <Link to="/" onClick={closeMobile} className="text-2xl font-bold text-black dark:text-white">
                    <img className="max-h-15 max-w-15 rounded" src="src/images/logo.png"/>
                </Link>
            </div>

            <div className="flex-1 flex justify-center text-black dark:text-white text-xl font-sans">
                <Options isMobile closeAll={closeMobile} />
            </div>

            <div className="flex-1 flex justify-end">
            {user ? (
                <button className="text-red-700 dark:text-red-400 cursor-pointer border rounded px-3 py-2 hover:opacity-70" onClick={handleLogoutClick}>
                    Sign out ({user.email})
                </button>
             ) : (
                <button className="bg-blue-600 text-white rounded px-4 py-2 disabled:opacity-60 hover:opacity-70" onClick={handleLoginClick}>
                    Login
                </button>
                )}
            </div>
            
            <button>
            <img
            src={"https://placehold.co/96x96?text=👤"}
            alt="avatar"
            className="w-15 h-15 rounded-full object-cover border"/>
            </button>


            
        </header>
    );
}

export default Navbar;
