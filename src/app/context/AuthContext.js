// "use client";

// import { createContext, useContext, useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { reloadPage } from "@/app/serviveAPI/ReloadPage/reloadpageService";

// const AuthContext = createContext(null);

// export function useAuth() {
//     return useContext(AuthContext);
// }

// export function AuthProvider({ children }) {
//     const router = useRouter();
//     const [isAuthenticated, setIsAuthenticated] = useState(null);
//     const [hasMounted, setHasMounted] = useState(false); // ✅ ป้องกัน SSR ใช้ `useEffect`

//     useEffect(() => {
//         setHasMounted(true); // ✅ ให้ค่าโหลดบน Client เท่านั้น
//         const token = localStorage.getItem("access_token");

//         if (!token) {
//             console.warn("🔴 No access token found, redirecting to login...");
//             router.replace("/");
//             return;
//         }

//         setIsAuthenticated(true);
//         reloadPage();
//         const interval = setInterval(reloadPage, 3600000);
//         return () => clearInterval(interval);
//     }, [router]);

//     if (!hasMounted) {
//         return null; // ✅ ป้องกัน Hydration failed
//     }

//     return (
//         <AuthContext.Provider value={{ isAuthenticated }}>
//             {children}
//         </AuthContext.Provider>
//     );
// }
// แก้ไข Cookies

"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { reloadPage } from "@/app/serviveAPI/ReloadPage/reloadpageService";
import Cookies from "js-cookie"; // ✅ ใช้ js-cookie แทน localStorage

const AuthContext = createContext(null);

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [hasMounted, setHasMounted] = useState(false); // ✅ ป้องกัน SSR

    useEffect(() => {
        setHasMounted(true); // ✅ ให้ค่าโหลดบน Client เท่านั้น
        
        // ✅ อ่าน `access_token` จาก Cookies แทน `localStorage`
        const token = Cookies.get("access_token");

        if (!token) {
            console.warn("🔴 No access token found, redirecting to login...");
            // router.replace("/");
            return;
        }

        console.log("✅ Access Token พบใน Cookies:", token);
        setIsAuthenticated(true);
        reloadPage();
        
        // ✅ รีโหลดทุก 1 ชั่วโมง
        const interval = setInterval(reloadPage, 3600000);
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
