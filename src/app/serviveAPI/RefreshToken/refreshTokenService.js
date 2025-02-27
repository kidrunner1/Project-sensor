// import axios from "axios";
// import ipconfig from "@/app/ipconfig";

// // ✅ URL API
// const REFRESH_API = `http://${ipconfig.API_HOST}/api/auth/refresh-access-token`;

// export async function refreshAccessToken() {
//     const refreshToken = localStorage.getItem("refresh_token");
//     const userId = localStorage.getItem("user_id");
//     const currentAccessToken = localStorage.getItem("access_token");

//     if (!refreshToken || !userId) {
//         console.warn("❌ ไม่มี Refresh Token หรือ User ID → ต้องให้ผู้ใช้ Login ใหม่");
//         return null;
//     }

//     try {
//         console.log("🔄 กำลัง Refresh Access Token...");

//         const response = await axios.post(REFRESH_API, {
//             user_id: userId,
//             access_token: currentAccessToken, // ✅ ส่ง access_token ปัจจุบันให้ API
//         }, {
//             headers: {
//                 Authorization: `Bearer ${refreshToken}`, // ✅ ใช้ Refresh Token ใน Header
//                 "Content-Type": "application/json"
//             }
//         });

//         console.log("🔄 Refreshed Token Response:", response.data);

//         // ✅ ตรวจสอบค่า response
//         const isExpired = response.data.hasOwnProperty("is_expired") ? !!response.data.is_expired : false;
//         const isRevoked = response.data.hasOwnProperty("is_revoked") ? !!response.data.is_revoked : false;
//         let newAccessToken = response.data.new_access_token || response.data.access_token || null;

//         console.log("🔹 is_expired:", isExpired);
//         console.log("🔹 is_revoked:", isRevoked);
//         console.log("🔹 new_access_token:", newAccessToken || "❌ ไม่มี Access Token ใหม่");

//         // ❌ ตรวจสอบว่า new_access_token ไม่ใช่ refresh_token
//         if (newAccessToken === refreshToken) {
//             console.error("❌ new_access_token ที่ได้รับมาเป็น refresh_token ซึ่งผิดพลาด!");
//             localStorage.clear();
//             return null;
//         }

//         // ✅ ถ้ามี new_access_token ให้ใช้แทนค่าเดิม
//         if (newAccessToken) {
//             localStorage.setItem("access_token", newAccessToken);
//             localStorage.setItem("access_expires_time", response.data.access_expires);
//             localStorage.setItem("refresh_token", response.data.refresh_token);
//             localStorage.setItem("refresh_expires_time", response.data.refresh_expires);
//             localStorage.setItem("user_status", response.data.user_status);

//             console.log("✅ Access Token ถูกอัปเดตเรียบร้อยแล้ว:", newAccessToken);
//             return newAccessToken;
//         }

//         console.warn("❌ ไม่มี Access Token ใน Response → ต้องให้ผู้ใช้ Login ใหม่");
//         return null;
//     } catch (error) {
//         console.error("❌ Refresh token failed:", error.response?.data || error.message);

//         if (error.response?.status === 401) {
//             console.warn("🔄 Refresh Token หมดอายุ → ผู้ใช้ต้อง Login ใหม่");
//             localStorage.clear();
//             return null;
//         }

//         return null;
//     }
// }

import axios from "axios";
import ipconfig from "@/app/ipconfig";
import Cookies from "js-cookie";

// ✅ URL API
const REFRESH_API = `http://${ipconfig.API_HOST}/api/auth/refresh-access-token`;

export async function refreshAccessToken() {
    const refreshToken = Cookies.get("refresh_token");
    const userId = Cookies.get("user_id");
    const currentAccessToken = Cookies.get("access_token");

    if (!refreshToken || !userId) {
        console.warn("❌ ไม่มี Refresh Token หรือ User ID → ต้องให้ผู้ใช้ Login ใหม่");
        return null;
    }

    try {
        console.log("🔄 กำลัง Refresh Access Token...");

        const response = await axios.post(REFRESH_API, {
            user_id: userId,
            access_token: currentAccessToken, // ✅ ส่ง access_token ปัจจุบันให้ API
        }, {
            headers: {
                Authorization: `Bearer ${refreshToken}`, // ✅ ใช้ Refresh Token ใน Header
                "Content-Type": "application/json"
            }
        });

        console.log("🔄 Refreshed Token Response:", response.data);

        // ✅ ตรวจสอบ Response ที่ได้รับ
        const {
            access_token: newAccessToken,
            refresh_token: newRefreshToken,
            access_expires: accessExpires,
            refresh_expires: refreshExpires,
            user_status,
            company_exist,
            company_id
        } = response.data;

        console.log("🔹 Access Token ใหม่:", newAccessToken || "❌ ไม่มี Access Token");
        console.log("🔹 Refresh Token ใหม่:", newRefreshToken || "❌ ไม่มี Refresh Token");
        console.log("🔹 หมดอายุ Access Token:", accessExpires);
        console.log("🔹 หมดอายุ Refresh Token:", refreshExpires);
        console.log("🔹 User Status:", user_status);
        console.log("🔹 มีบริษัทหรือไม่:", company_exist);
        console.log("🔹 Company ID:", company_id || "ไม่มีข้อมูล");

        // ❌ ตรวจสอบว่า new_access_token ไม่ใช่ refresh_token
        if (newAccessToken === refreshToken) {
            console.error("❌ new_access_token ที่ได้รับมาเป็น refresh_token ซึ่งผิดพลาด!");
            Cookies.clear();
            return null;
        }

        // ✅ ถ้ามี new_access_token ให้ใช้แทนค่าเดิม
        if (newAccessToken) {
            Cookies.set("access_token", newAccessToken);
            Cookies.set("access_expires_time", accessExpires);
            Cookies.set("refresh_token", newRefreshToken);
            Cookies.set("refresh_expires_time", refreshExpires);
            Cookies.set("user_status", user_status);

            if (company_exist) {
                Cookies.set("company_id", company_id);
            } else {
                Cookies.remove("company_id");
            }

            console.log("✅ Access Token ถูกอัปเดตเรียบร้อยแล้ว:", newAccessToken);
            return newAccessToken;
        }

        console.warn("❌ ไม่มี Access Token ใน Response → ต้องให้ผู้ใช้ Login ใหม่");
        return null;
    } catch (error) {
        console.error("❌ Refresh token failed:", error.response?.data || error.message);

        if (error.response?.status === 401) {
            console.warn("🔄 Refresh Token หมดอายุ → ผู้ใช้ต้อง Login ใหม่");
            Cookies.clear();
            return null;
        }

        return null;
    }
}

