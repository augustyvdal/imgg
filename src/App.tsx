import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./contexts/AuthContext";
import { ProfileModelProvider } from "./contexts/ProfileModelContext";
import AccountStateTransition from "./components/AccountStateTransition";

export default function App() {
    return (
        <AuthProvider>
            <ProfileModelProvider>
                <AccountStateTransition />
                <Navbar/>
                <AppRoutes />
            </ProfileModelProvider>
        </AuthProvider>
    );
}
