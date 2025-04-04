import axios from "axios";
import ipconfig from "@/app/ipconfig";
import Swal from "sweetalert2";

const REFRESH_API = `https://${ipconfig.API_HOST}/api/auth/refresh-access-token`;

export function reloadPage() {

    // ✅ ตรวจสอบก่อนว่าโค้ดรันบน Client-Side หรือไม่
    if (typeof window === "undefined") {
        console.warn("⚠️ reloadPage() ถูกเรียกบน Server → ข้ามการทำงาน");
        return;
    }

    // console.log("🔄 Checking tokens in sessionStorage...");

    const accessToken = sessionStorage.getItem("access_token");
    const refreshToken = sessionStorage.getItem("refresh_token");
    const userId = sessionStorage.getItem("user_id");
    const accessExpiresTime = sessionStorage.getItem("access_expires_time");
    const refreshExpiresTime = sessionStorage.getItem("refresh_expires_time");

    if (!refreshToken || !userId || !accessExpiresTime || !refreshExpiresTime) {
        // console.warn("❌ Token ไม่ครบ → ผู้ใช้ต้องเข้าสู่ระบบใหม่");
        showSessionExpiredAlert();
        return;
    }

    const now = new Date();
    const accessExpiresDate = new Date(accessExpiresTime);
    const refreshExpiresDate = new Date(refreshExpiresTime);

    console.log("🔹 Access Token Expiry:", accessExpiresDate);
    console.log("🔹 Refresh Token Expiry:", refreshExpiresDate);
    console.log("🔹 Current Time:", now);

    // ✅ เงื่อนไขที่ 1: ถ้า Refresh Token หมดอายุ → ตรวจสอบก่อน Logout
    if (now >= refreshExpiresDate) {
        // console.warn("❌ Refresh Token หมดอายุ → ต้อง Login ใหม่");

        // เช็คว่า Access Token ล่าสุดยังอยู่หรือไม่
        const updatedAccessToken = sessionStorage.getItem("access_token");
        if (updatedAccessToken) {
            console.log("✅ พบ Access Token ใน sessionStorage → อยู่ในระบบต่อไป");
            return;
        }

        showSessionExpiredAlert();
        return;
    }

    // ✅ เงื่อนไขที่ 2: ถ้า Access Token ยังไม่หมดอายุ → อยู่ในระบบต่อไป
    if (now < accessExpiresDate) {
        
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
            console.log("✅ API Response:", response.data);

            const newAccessToken = response.data.new_access_token;
            const newAccessExpiresTime = response.data.access_expires;

            // ✅ เช็คก่อนว่า API คืนค่า `new_access_token` จริงหรือไม่
            if (!newAccessToken) {

                // เช็คว่า Access Token เดิมยังอยู่หรือไม่
                const updatedAccessToken = sessionStorage.getItem("access_token");
                if (updatedAccessToken) {
                    console.log("✅ พบ Access Token เดิมใน sessionStorage → อยู่ในระบบต่อไป");
                    return;
                }

                // ❌ ถ้าไม่มีจริง ๆ → ค่อย Logout
                showSessionExpiredAlert();
                return;
            }

            console.log("✅ ได้รับ Access Token ใหม่:", newAccessToken);

            // ✅ อัปเดต Access Token ใน sessionStorage ก่อนทำการเช็ค Logout
            sessionStorage.setItem("access_token", newAccessToken);
            sessionStorage.setItem("access_expires_time", newAccessExpiresTime);

            console.log("✅ Access Token อัปเดตเรียบร้อย! อยู่ในระบบต่อไป...");
        })
        .catch((error) => {
            console.error("❌ Refresh Token API Error:", error.response?.data || error.message);

            // ตรวจสอบว่า Access Token เดิมยังอยู่หรือไม่ ก่อน Logout
            const updatedAccessToken = sessionStorage.getItem("access_token");
            if (updatedAccessToken) {
                console.log("✅ พบ Access Token ใน sessionStorage → อยู่ในระบบต่อไป");
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
        sessionStorage.removeItem("company_id")
        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("refresh_token");
        sessionStorage.removeItem("user_id");
        sessionStorage.removeItem("access_expires_time");
        sessionStorage.removeItem("refresh_expires_time");
        
        window.location.href = "/";
    });
}
