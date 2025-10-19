import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./contexts/AuthContext";
import { ProfileModelProvider } from "./contexts/ProfileModelContext";

export default function App() {
    return (
        <AuthProvider>
            <ProfileModelProvider>
                <Navbar />
                <AppRoutes />
            </ProfileModelProvider>
        </AuthProvider>
    );
}
