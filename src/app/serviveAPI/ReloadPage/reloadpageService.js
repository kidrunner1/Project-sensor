import axios from "axios";
import ipconfig from "@/app/ipconfig";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

const REFRESH_API = `http://${ipconfig.API_HOST}/api/auth/refresh-access-token`;

export function reloadPage() {
    if (typeof window === "undefined") {
        return;
    }

    console.log("🔄 Checking tokens in Cookies...");

    const accessToken = Cookies.get("access_token");
    const refreshToken = Cookies.get("refresh_token");
    const userId = Cookies.get("user_id");
    const accessExpiresTime = Cookies.get("access_expires_time");
    const refreshExpiresTime = Cookies.get("refresh_expires_time");

    if (!refreshToken || !userId || !accessExpiresTime || !refreshExpiresTime) {
        console.warn("❌ Token ไม่ครบ → ผู้ใช้ต้องเข้าสู่ระบบใหม่");
        showSessionExpiredAlert();
        return;
    }

    const now = new Date();
    const accessExpiresDate = new Date(accessExpiresTime);
    const refreshExpiresDate = new Date(refreshExpiresTime);

    console.log("🔹 Access Token Expiry:", accessExpiresDate);
    console.log("🔹 Refresh Token Expiry:", refreshExpiresDate);
    console.log("🔹 Current Time:", now);

    // ✅ ถ้า Refresh Token หมดอายุ → ผู้ใช้ต้อง Login ใหม่
    if (now >= refreshExpiresDate) {
        console.warn("❌ Refresh Token หมดอายุ → ต้อง Login ใหม่");
        showSessionExpiredAlert();
        return;
    }

    // ✅ ถ้า Access Token ยังไม่หมดอายุ → อยู่ในระบบต่อไป
    if (now < accessExpiresDate) {
        console.log("✅ Access Token ยังใช้งานได้ → ไม่ต้อง Refresh");
        return;
    }

    // 🔄 ถ้า Access Token หมดอายุ แต่ Refresh Token ยังใช้ได้ → ขอ `new_access_token` จาก API
    console.log("🔄 Access Token หมดอายุ → กำลัง Refresh...");

    axios
        .post(
            REFRESH_API,
            { user_id: userId, access_token: accessToken },
            {
                headers: { Authorization: `Bearer ${refreshToken}`, "Content-Type": "application/json" },
                withCredentials: true, // ✅ ส่ง Cookies ไปกับ API
            }
        )
        .then((response) => {
            console.log("✅ API Response:", response.data);

            const newAccessToken = response.data.new_access_token;
            const newAccessExpiresTime = response.data.access_expires;

            if (!newAccessToken) {
                console.warn("❌ ไม่มี Access Token ใหม่ → ออกจากระบบ");
                showSessionExpiredAlert();
                return;
            }

            console.log("✅ ได้รับ Access Token ใหม่:", newAccessToken);

            // ✅ อัปเดต Access Token ใน Cookies
            Cookies.set("access_token", newAccessToken, { path: "/", secure: true });
            Cookies.set("access_expires_time", newAccessExpiresTime, { path: "/", secure: true });

            console.log("✅ Access Token อัปเดตเรียบร้อย! อยู่ในระบบต่อไป...");
        })
        .catch((error) => {
            console.error("❌ Refresh Token API Error:", error.response?.data || error.message);
            showSessionExpiredAlert();
        });
}

// 📌 Function แจ้งเตือนให้ผู้ใช้ Login ใหม่
function showSessionExpiredAlert() {
    Swal.fire({
        title: "เซสชันหมดอายุ",
        text: "กรุณาเข้าสู่ระบบใหม่เพื่อใช้งานต่อ",
        icon: "warning",
        confirmButtonText: "เข้าสู่ระบบใหม่",
        allowOutsideClick: false,
    }).then(() => {
        // 🔹 ลบค่าที่เกี่ยวข้องกับเซสชันจาก Cookies
        Cookies.remove("company_id");
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        Cookies.remove("user_id");
        Cookies.remove("access_expires_time");
        Cookies.remove("refresh_expires_time");

        window.location.href = "/";
    });
}
