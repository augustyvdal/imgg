import { useEffect, useState } from "react";
import { fetchLeaderboardData, LeaderboardData, LeaderboardRow } from "../models/LeaderboardModel";
import LeaderboardView from "../views/LeaderboardView";
import { useNavigate } from "react-router-dom";


export default function LeaderboardPresenter() {
  const navigate = useNavigate();
  const [data, setData] = useState<LeaderboardData>({ higherLowerRows: [], sortRows: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<string | undefined>(undefined);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchLeaderboardData(20, category);
      setData(result);
    } catch (e: any) {
      setError(e.message || "Failed to load leaderboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [category]);

  const goToHome = () => {
    navigate("/");
  };

  return (
    <LeaderboardView
      higherLowerRows={data.higherLowerRows}
      sortRows={data.sortRows}
      loading={loading}
      error={error}
      category={category}
      onCategoryChange={setCategory}
      onReload={load}
      goToHome={goToHome}
    />
  );
}
