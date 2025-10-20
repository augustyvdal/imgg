import { Link } from 'react-router-dom';
import {  useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { getMyProfile } from "../services/profileService";

function Options() {

    const linkClass = (path: string) =>
        `nav-link ${
            location.pathname === path
                ? "underline opacity-100" // active
                : "opacity-80 hover:opacity-50" // inactive
        }`;

    return (
        <nav className={"flex flex-row gap-10 items-center"}>
            <Link to="/leaderboard" className={`text-2xl font-bold text-black dark:text-white ${linkClass("/leaderboard")}`} >Leaderboards</Link>
        </nav>
    );
}

const Navbar = () => {
    const { user, signOut } = useAuth() as any;
    const navigate = useNavigate();
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            if (!user) return setAvatarUrl(null);

            try {
                const profile = await getMyProfile();
                if (profile?.avatar_url) {
                    const { data } = supabase.storage.from("avatars").getPublicUrl(profile.avatar_url);
                    setAvatarUrl(data.publicUrl);
                } else {
                    setAvatarUrl(null);
                }
            } catch (err) {
                console.error("Failed to load avatar:", err);
                setAvatarUrl(null);
            }
        })();
    }, [user]);

    const handleLoginClick = () => {
        navigate("/login");
    }

    const handleLogoutClick = async () => {
        await signOut();
        navigate("/");
    }

    const handleLogoClick = () => {
        navigate("/");
    }

    const toProfile = () => {
        navigate("/profile");
    }

    return (
        <header className="fixed top-0 z-50 w-full h-20 flex flex-row px-4 py-3">
                <div className="flex-1">
                        <img alt="logo" className="max-h-15 max-w-15 rounded text-2xl font-bold text-black dark:text-white cursor-pointer hover:scale-104 transition-transform" src="/logo_solid_bg.png" onClick={handleLogoClick}/>
                </div>

                <div className="flex-1 flex justify-center text-black dark:text-white text-xl font-sans">
                    <Options />
                </div>

                <div className="flex-1 flex justify-end">
                {user ? (
                    <div className="flex flex-row items-center">
                        <div className="dropdown relative inline-block focus-within:outline-none">
                            <img
                                src={avatarUrl ?? "https://placehold.co/96x96?text=👤"}
                                alt="avatar"
                                tabIndex={0} // make it focusable
                                className="dropdown__trigger"
                            />
                            <div className="dropdown__content hidden absolute bg-white dark:bg-gray-700 min-w-[160px] shadow-lg rounded-md mt-2 z-10 right-0 p-1">
                                <Link to="/profile" className="dropdown__item">
                                Profile
                                </Link>
                                <button className="dropdown__item btn--signout" onClick={handleLogoutClick}>
                                Sign out
                                </button>
                            </div>
                        </div>
                    </div>
                 ) : (
                    <button className="btn--default" onClick={handleLoginClick}>
                        Login
                    </button>
                    )}
                </div>
            </header>
    );
}

export default Navbar;
