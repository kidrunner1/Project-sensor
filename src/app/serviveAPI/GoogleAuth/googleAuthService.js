import axios from "axios";
import ipconfig from "@/app/ipconfig";

const GOOGLE_AUTH_URL = `http://${ipconfig.API_HOST}/api/auth/google/login`;
const GOOGLE_CALLBACK_URL = `http://${ipconfig.API_HOST}/api/auth/google/callback`;

// ✅ ฟังก์ชันเปิด Google Login เป็น Popup
export function loginWithGooglePopup() {
    return new Promise((resolve, reject) => {
        const width = 500;
        const height = 600;
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;

        // ✅ เปิด Popup Window
        const popup = window.open(
            `http://localhost:8080/api/auth/google/login`,
            "Google Login",
            `width=${width},height=${height},top=${top},left=${left}`
        );

        if (!popup) {
            reject(new Error("❌ ไม่สามารถเปิดหน้าต่าง Google Login ได้ (อาจโดนบล็อก)"));
            return;
        }

        let popupClosed = false;
        const checkPopup = setInterval(() => {
            if (!popup || popup.closed) {
                clearInterval(checkPopup);
                popupClosed = true;
                reject(new Error("❌ Google Login Popup ถูกปิดก่อนยืนยัน"));
            }
        }, 500);

        // ✅ รอให้ Popup ส่งข้อมูลกลับมา
        window.addEventListener("message", (event) => {
            if (event.origin !== window.location.origin) return;

            clearInterval(checkPopup);
            popupClosed = false;
            popup.close();

            const { access_token, refresh_token, token_expiry, user } = event.data;

            if (access_token) {
                localStorage.setItem("access_token", access_token);
                localStorage.setItem("refresh_token", refresh_token);
                localStorage.setItem("token_expiry", token_expiry);
                localStorage.setItem("userId", user.id);
                localStorage.setItem("userName", user.name);

                Swal.fire({
                    title: "เข้าสู่ระบบสำเร็จ!",
                    text: "กำลังพาคุณไปยัง Dashboard...",
                    icon: "success",
                    confirmButtonText: "ตกลง",
                }).then(() => {
                    window.location.href = "/MainDashboard"; // ✅ Redirect ไปหน้า Dashboard
                });

                resolve(true);
            } else {
                reject(new Error("❌ ไม่ได้รับ Token จาก Google Login"));
            }
        });

        // ✅ เช็คว่าปิด Popup ไปก่อนที่ Google Login จะสำเร็จหรือไม่
        setTimeout(() => {
            if (popupClosed) {
                reject(new Error("❌ Google Login ถูกปิดก่อนยืนยัน"));
            }
        }, 5000);
    });
}


