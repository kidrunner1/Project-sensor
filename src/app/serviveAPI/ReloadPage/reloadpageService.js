import axios from "axios";
import ipconfig from "@/app/ipconfig";
import Swal from "sweetalert2";

const REFRESH_API = `http://${ipconfig.API_HOST}/api/auth/refresh-access-token`;

export function reloadPage() {

    // ✅ ตรวจสอบก่อนว่าโค้ดรันบน Client-Side หรือไม่
    if (typeof window === "undefined") {
        // console.warn("⚠️ reloadPage() ถูกเรียกบน Server → ข้ามการทำงาน");
        return;
    }

    // console.log("🔄 Checking tokens in localStorage...");

    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");
    const userId = localStorage.getItem("user_id");
    const accessExpiresTime = localStorage.getItem("access_expires_time");
    const refreshExpiresTime = localStorage.getItem("refresh_expires_time");

    if (!refreshToken || !userId || !accessExpiresTime || !refreshExpiresTime) {
        // console.warn("❌ Token ไม่ครบ → ผู้ใช้ต้องเข้าสู่ระบบใหม่");
        showSessionExpiredAlert();
        return;
    }

    const now = new Date();
    const accessExpiresDate = new Date(accessExpiresTime);
    const refreshExpiresDate = new Date(refreshExpiresTime);

    // console.log("🔹 Access Token Expiry:", accessExpiresDate);
    // console.log("🔹 Refresh Token Expiry:", refreshExpiresDate);
    // console.log("🔹 Current Time:", now);

    // ✅ เงื่อนไขที่ 1: ถ้า Refresh Token หมดอายุ → ตรวจสอบก่อน Logout
    if (now >= refreshExpiresDate) {
        // console.warn("❌ Refresh Token หมดอายุ → ต้อง Login ใหม่");

        // เช็คว่า Access Token ล่าสุดยังอยู่หรือไม่
        const updatedAccessToken = localStorage.getItem("access_token");
        if (updatedAccessToken) {
            // console.log("✅ พบ Access Token ใน localStorage → อยู่ในระบบต่อไป");
            return;
        }

        showSessionExpiredAlert();
        return;
    }

    // ✅ เงื่อนไขที่ 2: ถ้า Access Token ยังไม่หมดอายุ → อยู่ในระบบต่อไป
    if (now < accessExpiresDate) {
        // console.log("✅ Access Token ยังใช้งานได้ → ไม่ต้อง Refresh");
        return;
    }

    // 🔄 เงื่อนไขที่ 3: ถ้า Access Token หมดอายุ แต่ Refresh Token ยังใช้ได้ → ขอ `new_access_token` จาก API
    console.log("🔄 Access Token หมดอายุ → กำลัง Refresh...");

    axios
        .post(
            REFRESH_API,
            { user_id: userId, access_token: accessToken },
            { headers: { Authorization: `Bearer ${refreshToken}`, "Content-Type": "application/json" } }
        )
        .then((response) => {
            // console.log("✅ API Response:", response.data);

            const newAccessToken = response.data.new_access_token;
            const newAccessExpiresTime = response.data.access_expires;

            // ✅ เช็คก่อนว่า API คืนค่า `new_access_token` จริงหรือไม่
            if (!newAccessToken) {

                // เช็คว่า Access Token เดิมยังอยู่หรือไม่
                const updatedAccessToken = localStorage.getItem("access_token");
                if (updatedAccessToken) {
                    // console.log("✅ พบ Access Token เดิมใน localStorage → อยู่ในระบบต่อไป");
                    return;
                }

                // ❌ ถ้าไม่มีจริง ๆ → ค่อย Logout
                showSessionExpiredAlert();
                return;
            }

            // console.log("✅ ได้รับ Access Token ใหม่:", newAccessToken);

            // ✅ อัปเดต Access Token ใน localStorage ก่อนทำการเช็ค Logout
            localStorage.setItem("access_token", newAccessToken);
            localStorage.setItem("access_expires_time", newAccessExpiresTime);

            // console.log("✅ Access Token อัปเดตเรียบร้อย! อยู่ในระบบต่อไป...");
        })
        .catch((error) => {
            // console.error("❌ Refresh Token API Error:", error.response?.data || error.message);

            // ตรวจสอบว่า Access Token เดิมยังอยู่หรือไม่ ก่อน Logout
            const updatedAccessToken = localStorage.getItem("access_token");
            if (updatedAccessToken) {
                // console.log("✅ พบ Access Token ใน localStorage → อยู่ในระบบต่อไป");
                return;
            }

            showSessionExpiredAlert();
        });
}

// 📌 Function แจ้งเตือนให้ผู้ใช้ Login ใหม่ (แต่ไม่ออกทันที)
function showSessionExpiredAlert() {
    Swal.fire({
        title: "เซสชันหมดอายุ",
        text: "กรุณาเข้าสู่ระบบใหม่เพื่อใช้งานต่อ",
        icon: "warning",
        confirmButtonText: "เข้าสู่ระบบใหม่",
        allowOutsideClick: false,
    }).then(() => {
        // 🔹 ลบเฉพาะค่าที่เกี่ยวข้องกับเซสชัน
        localStorage.removeItem("company_id")
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user_id");
        localStorage.removeItem("access_expires_time");
        localStorage.removeItem("refresh_expires_time");
        // localStorage.clear();
        window.location.href = "/";
    });
}
