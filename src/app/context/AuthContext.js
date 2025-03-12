"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { reloadPage } from "@/app/serviveAPI/ReloadPage/reloadpageService";

const AuthContext = createContext(null);

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [hasMounted, setHasMounted] = useState(false); // ✅ ป้องกัน SSR ใช้ `useEffect`

    useEffect(() => {
        setHasMounted(true); // ✅ ให้ค่าโหลดบน Client เท่านั้น
        const token = sessionStorage.getItem("access_token");

        if (!token) {
            console.warn("🔴 No access token found, redirecting to login...");
            router.replace("/");
            return;
        }

        setIsAuthenticated(true);
        reloadPage();
        const interval = setInterval(reloadPage, 60000);
        return () => clearInterval(interval);
    }, [router]);

    if (!hasMounted) {
        return null; // ✅ ป้องกัน Hydration failed
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
}
