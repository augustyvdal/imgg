import { useEffect, useState, FormEvent } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import ProfileView from "../views/ProfileView";


type ProfilePresenterProps = {
    model: typeof import("../models/ProfileModel").default;
};

export default function ProfilePresenter({ model }: ProfilePresenterProps) {
    const { user, loading } = useAuth() as any;
    const navigate = useNavigate();

    const [state, setState] = useState(model.createInitialState());
    const [username, setUsername] = useState("");
    const [category, setCategory] = useState<"movie" | "tv">("movie");
    const [games, setGames] = useState<number[]>([]);
    const [loadingGames, setLoadingGames] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);


    useEffect(() => {
        if (!loading && !user) navigate("/login");
    }, [loading, user, navigate]);

    useEffect(() => {
        if (!loading && user) {
            model.init(state).then(setState);
        }
    }, [user, loading]);

    useEffect(() => {
        if (state.profile) setUsername(state.profile.username ?? "");
    }, [state.profile]);

    useEffect(() => {
    if (!user) return;

    setLoadingGames(true);
    setGames([]);

    model.fetchMatchHistory(category)
    .then(scores => {
        const clean = scores.filter((x): x is number => typeof x === "number");
        setGames(clean.slice().reverse());
    })
    .catch(e => {
        console.error("Failed to load match history:", e);
        setGames([]);
    })
    .finally(() => setLoadingGames(false));
    }, [user, category, refreshKey]);

    async function onSave(e: FormEvent) {
        e.preventDefault();
        setState(s => ({ ...s, saving: true, error: null }));

        const newState = await model.setUsername(state, username || null);
        setState(newState);
    }

    async function handlePickFile(file: File) {
        setState(s => ({ ...s, uploading: true, error: null }));

        const newState = await model.setAvatar(state, file);
        setState(newState);
    }

    const goToHome = () => {
        navigate("/");
    };

    if (loading || !user) return null;

    return (
        <ProfileView
            userEmail={user.email}
            username={username}
            onUsernameChange={setUsername}
            saving={state.saving}
            onSave={onSave}
            avatarUrl={state.avatarPublicUrl}
            uploading={state.uploading}
            onPickFile={(f) => f && handlePickFile(f)}
            err={state.error}
            ok={null}
            category={category}
            onCategoryChange={setCategory}
            loadingGames={loadingGames}
            games={games}
            onRefresh={() => setRefreshKey(k => k + 1)}
            goToHome={goToHome}
        />
    );
}
