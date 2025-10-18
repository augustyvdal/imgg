import { useNavigate } from "react-router-dom";
import HomeView from "../views/HomeView";

export default function HomePresenter() {
  const navigate = useNavigate();

  const handleStartGuessTheMovie = () => navigate("/game1");
  const handleStartHigherLower = () => navigate("/game2");
  const handleStartSortGame = () => navigate("/game3");

  return (
    <HomeView
      onStartGuessTheMovie={handleStartGuessTheMovie}
      onStartHigherLower={handleStartHigherLower}
      onStartSortGame={handleStartSortGame}
    />
  );
}
