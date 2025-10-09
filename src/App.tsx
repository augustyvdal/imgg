import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./contexts/AuthContext";
import { HigherLowerModel } from "./models/higherLowerModel";
import { SortGameModel } from "./models/SortGameModel";

type Props = {
  higherLowerModel: HigherLowerModel;
  sortGameModel: SortGameModel;
};

export default function App({ higherLowerModel, sortGameModel }: Props) {
    return (
        <AuthProvider>
            <Navbar />
            <AppRoutes
                higherLowerModel={higherLowerModel}
                sortGameModel={sortGameModel}
            />
        </AuthProvider>
    );
}
