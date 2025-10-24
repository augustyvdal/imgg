import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import Spinner from "./Spinner";

export default function AccountStateTransition() {
    const { transitioning } = useAuth();

    return (
        <AnimatePresence>
            {transitioning && (
                <motion.div
                    key="transition-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="fixed inset-0 flex items-center justify-center bg-col3/90 z-[9999]"
                >
                    <Spinner />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
