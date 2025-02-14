import axios from "axios";
import ipconfig from "@/app/ipconfig";
import Swal from "sweetalert2";

// ✅ URL API
const REFRESH_API = `http://${ipconfig.API_HOST}/api/auth/refresh-access-token`;
const LOGOUT_API = `http://${ipconfig.API_HOST}/api/auth/logout`;

export async function logoutUser() {
    let accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");
    const userId = localStorage.getItem("user_id");

    // if (!userId || !refreshToken) {
    //     console.error("❌ ไม่พบ `user_id` หรือ `refresh_token` → ผู้ใช้ต้อง Login ใหม่");
    //     localStorage.clear();
    //     window.location.href = "/";
    //     return;
    // }

    console.log("🔹 `user_id` ที่ใช้สำหรับ Logout:", userId);
    console.log("🔹 `access_token` ก่อน Logout:", accessToken);
    console.log("🔹 `refresh_token` ก่อน Logout:", refreshToken);

    try {
        // ✅ 1. ตรวจสอบ Access Token โดยเรียก API `/auth/refresh-access-token`
        console.log("🔄 กำลังตรวจสอบ Access Token...");

        let newAccessToken = null; // ✅ กำหนดตัวแปรรองรับ Access Token ใหม่
        const refreshResponse = await axios.post(REFRESH_API, {
            user_id: userId,
            access_token: accessToken
        }, {
            headers: {
                Authorization: `Bearer ${refreshToken}`, // ✅ ใช้ Refresh Token ใน Header
                "Content-Type": "application/json"
            }
        });

        console.log("🔄 ✅ Refresh Token Response:", refreshResponse.data);

        // ✅ ตรวจสอบค่าที่ API ส่งกลับมา
        const isExpired = refreshResponse.data.hasOwnProperty("is_expired") ? String(refreshResponse.data.is_expired) : "false";
        const isRevoked = refreshResponse.data.hasOwnProperty("is_revoked") ? !!refreshResponse.data.is_revoked : false;
        newAccessToken = refreshResponse.data.new_access_token || null;

        const NewAC = localStorage.setItem("new_access_token", newAccessToken); // ✅ บันทึก new_access_token ลง Local Storage

        console.log("🔹 user_status:", refreshResponse.data.user_status);
        console.log("🔹 is_expired (string):", isExpired);
        console.log("🔹 is_revoked (boolean):", isRevoked);
        console.log("🔹 new_access_token ที่ได้จาก API:", newAccessToken || "❌ ไม่มี Access Token ใหม่");
        console.log("🔹 revoked_reason:", refreshResponse.data.revoked_reason);
        console.log("🔹 new_access_token ที่ได้รับ:", NewAC);

        // ✅ เงื่อนไขที่ 1: ถ้า `user_status = online` และ `is_expired = "false"`
        if (refreshResponse.data.user_status === "online" && isExpired === "false") {
            console.log("✅ Access Token ปัจจุบันยังใช้งานได้ → ใช้ทำ Logout");
            accessToken = localStorage.getItem("access_token"); // ✅ ใช้ Access Token เดิม
        }

        // ✅ เงื่อนไขที่ 2: ถ้ามี `"is_expired": "true", "is_revoked": true` → ใช้ `new_access_token` ทำ Logout
        else if (isExpired === "true" && isRevoked && newAccessToken) {
            // ❌ ตรวจสอบว่า new_access_token ไม่ใช่ refresh_token
            if (newAccessToken === refreshToken) {
                console.error("❌ new_access_token ที่ได้รับมาเป็น refresh_token ซึ่งผิดพลาด!");
                await Swal.fire({
                    title: "เกิดข้อผิดพลาด",
                    text: "API คืนค่า Token ผิดพลาด โปรดเข้าสู่ระบบใหม่",
                    icon: "error",
                    confirmButtonText: "ตกลง"
                });
                localStorage.clear();
                window.location.href = "/";
                return;
            }


            // ✅ บันทึก Access Token ใหม่ลง Local Storage
            localStorage.setItem("access_token", newAccessToken);
            localStorage.setItem("new_access_token", newAccessToken); // ✅ บันทึก new_access_token เพิ่มเข้าไป
            console.log("✅ อัปเดต new_access_token ใน Local Storage:", newAccessToken);

            // ✅ ดึงค่าจาก Local Storage มาใช้ใหม่
            accessToken = localStorage.getItem("new_access_token");
            console.log("🔄 `access_token` หลังจากอัปเดต:", accessToken);
        }

        // ❌ ถ้าไม่มี Access Token ใหม่ → อาจต้องให้ผู้ใช้ Login ใหม่
        else {
            console.warn("❌ ไม่มี Access Token ใหม่ → อาจต้องให้ผู้ใช้ Login ใหม่");
            localStorage.clear();
            await Swal.fire({
                title: "เซสชันหมดอายุ",
                text: "กรุณาเข้าสู่ระบบใหม่",
                icon: "warning",
                confirmButtonText: "ตกลง"
            });
            window.location.href = "/";
            return;
        }

        // ✅ Debug ค่าก่อนเรียก `/auth/logout`
        console.log("🚀 เตรียมส่งคำขอ Logout...");
        console.log("🔹 `user_id` ที่จะใช้:", userId);
        console.log("🔹 `access_token` ที่จะใช้:", accessToken);

        // ✅ 2. ส่งคำขอ Logout โดยใช้ Access Token ใหม่ (ถ้ามี)
        try {
            // ✅ Debug เช็คค่าก่อนส่ง API Logout
            console.log("🔹 เช็คค่าก่อน Logout...");
            console.log("🔹 URL API:", LOGOUT_API);
            console.log("🔹 Header ที่ใช้ส่งไป:", {
                Authorization: `${accessToken}`,
                "Content-Type": "application/json"
            });
            console.log("🔹 Body ที่ใช้ส่งไป:", { user_id: userId });

            // ✅ ส่งคำขอ Logout โดยใช้ Access Token ใหม่ (ถ้ามี)
            const logoutResponse = await axios.post(LOGOUT_API, { user_id: userId }, {
                headers: {
                    Authorization: `${accessToken}`,
                    "Content-Type": "application/json"
                }
            });

            console.log("✅ Logout API Response:", logoutResponse.data);

            if (logoutResponse.data.status === "logged_out") {
                await Swal.fire({
                    title: "ออกจากระบบสำเร็จ!",
                    text: logoutResponse.data.message || "คุณถูกออกจากระบบแล้ว",
                    icon: "success",
                    confirmButtonText: "ตกลง"
                });

                // ✅ ล้างข้อมูล Local Storage และ Redirect
                localStorage.clear();
                window.location.href = "/";
            } else {
                throw new Error("❌ Logout failed: Unexpected response.");
            }

        } catch (logoutError) {
            console.error("❌ Logout API Error:", logoutError);

            const errorMessage =
                logoutError.response?.data?.message || // ✅ ใช้ ?. เพื่อป้องกัน Error
                logoutError.message ||
                "เกิดข้อผิดพลาด ไม่สามารถออกจากระบบได้";

            await Swal.fire({
                title: "เกิดข้อผิดพลาด",
                text: errorMessage,
                icon: "error",
                confirmButtonText: "ตกลง"
            });
        }

    } catch (error) {
        console.error("❌ Logout error:", error.response?.data || error.message);
        throw new Error(`Logout failed: ${error.response?.data?.message || error.message}`);
    }
}






