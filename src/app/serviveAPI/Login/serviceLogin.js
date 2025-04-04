import axios from "axios";
import ipconfig from "@/app/ipconfig";

// ✅ URL API
const API_URL = `https://${ipconfig.API_HOST}/api/auth/login`;

// ✅ ฟังก์ชันสำหรับล็อกอินผู้ใช้
export async function loginUser(identifier, password, method = 'email') {
    try {
        const response = await axios.post(API_URL, {
            identifier: identifier,
            password: password,
            method: method,
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        console.log("📌 API Response:", JSON.stringify(response.data, null, 2)); // ✅ Debug Response

        // ✅ ดึง `user_id` จาก API Response
        const { message, user_id, expires_at, otp_debug } = response.data;

        if (!user_id) {
            console.error("❌ API ส่ง Response แต่ไม่มี `user_id`!");
        } else {
            console.log("✅ `user_id` ที่ได้รับจาก API:", user_id);
        }

        return {
            success: true,
            otpRequired: message.toLowerCase().includes("verify otp"),
            message: message,
            userId: user_id,  // ✅ ตรวจสอบว่ามีค่าหรือไม่
            expiresAt: expires_at,
            otpDebug: otp_debug,
        };

    } catch (error) {
        console.error("❌ Login error:", error);

        if (error.response) {
            throw new Error('เข้าสู่ระบบผิดพลาด: ' + (error.response.data.message || 'ไม่พบผู้ใช้งาน'));
        } else {
            throw new Error('เข้าสู่ระบบผิดพลาด: ' + error.message || 'ไม่พบผู้ใช้งาน');
        }
    }
}
