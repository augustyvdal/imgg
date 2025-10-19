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

    async function onSave(e: FormEvent) {
        e.preventDefault();
        const newState = await model.setUsername(state, username || null);
        setState(newState);
    }


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
            onPickFile={(f) => f && model.setAvatar(state, f)}
            err={state.error}
            ok={null}
            category={category}
            onCategoryChange={setCategory}
            loadingGames={false}
            games={[]}
            onRefresh={() => {}}
        />
    );
}
