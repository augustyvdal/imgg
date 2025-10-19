import { useEffect, useState } from "react";
import { getTopScores, type LeaderboardRow } from "../services/leaderboardService";
import { getSortLeaderboard, type SortRow } from "../services/sortGameLeaderboardService";
import LeaderboardView from "../views/LeaderboardView";

type Props = {
  loadHigherLower?: (limit: number, category?: string) => Promise<LeaderboardRow[]>;
  loadSort?: (limit: number, category?: string) => Promise<SortRow[]>;
};

export default function LeaderboardPresenter({
  loadHigherLower = getTopScores,
  loadSort = getSortLeaderboard,    
}: Props) {
  const [higherLowerRows, setHigherLowerRows] = useState<LeaderboardRow[]>([]);
  const [sortRows, setSortRows] = useState<SortRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<string | undefined>(undefined);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const higherLowerData = await loadHigherLower(20, category);
      setHigherLowerRows(higherLowerData);

      const sortData = await loadSort(20, category);
      setSortRows(sortData);
    } catch (e: any) {
      setError(e.message || "Failed to load leaderboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [category]);

  return (
    <LeaderboardView
      higherLowerRows={higherLowerRows}
      sortRows={sortRows}
      loading={loading}
      error={error}
      category={category}
      onCategoryChange={setCategory}
      onReload={load}
    />
  );
}
