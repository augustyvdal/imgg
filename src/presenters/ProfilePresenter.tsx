import { observer } from "mobx-react-lite";
import { useProfileModel } from "../contexts/ProfileModelContext";
import ProfileView from "../views/ProfileView";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, FormEvent } from "react";

export default observer(function ProfilePresenter() {
  const { user, loading } = useAuth() as any;
  const navigate = useNavigate();
  const model = useProfileModel();

  const [username, setUsername] = useState("");

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [loading, user, navigate]);

  useEffect(() => {
    if (model.profile) setUsername(model.profile.username ?? "");
  }, [model.profile]);

  const [category, setCategory] = useState<"movie" | "tv">("movie");

  const onSave = (e: FormEvent) => {
    e.preventDefault();
    model.setUsername(username || null);
  };

  if (loading || !user) return null;

  return (
    <ProfileView
      userEmail={user.email}
      username={username}
      onUsernameChange={setUsername}
      saving={model.saving}
      onSave={onSave}
      avatarUrl={model.avatarPublicUrl}
      uploading={model.uploading}
      onPickFile={(f) => f && model.setAvatar(f)}
      err={model.error}
      ok={null}
      category={category}
      onCategoryChange={setCategory}
      loadingGames={false}
      games={[]}
      onRefresh={() => {}}
    />
  );
});
