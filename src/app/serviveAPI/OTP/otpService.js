import axios from "axios";
import ipconfig from "@/app/ipconfig";

// ✅ URL สำหรับการเรียก API ยืนยัน OTP
const API_URL = `https://${ipconfig.API_HOST}/api/auth/verify-otp-login`;

// ✅ ฟังก์ชันสำหรับยืนยัน OTP และจัดเก็บ Token
export async function verifyOtp(userId, otp) {
    if (!userId || !otp) {
        throw new Error("❌ Missing user_id or otp.");
    }

    const otpData = { user_id: userId, otp: otp };

    try {
        const response = await axios.post(API_URL, otpData);

        // ✅ ดึงข้อมูลจาก Response
        const {
            access_token,
            refresh_token,
            access_expires_time,
            refresh_expires_time,
            message,
            roles,
            company_exist,
            company_id
        } = response.data;

        console.log("📌 API Response จาก Verify OTP:", JSON.stringify(response.data, null, 2));

        // ✅ ถ้า `user_id` ไม่มีใน Response ให้ใช้ค่าที่ส่งไป
        const finalUserId = response.data.user_id || userId;
        console.log("✅ `user_id` ที่จะบันทึกลง Local Storage:", finalUserId);

        // ✅ จัดเก็บ Token และ `user_id` ลง Local Storage
        sessionStorage.setItem("user_id", finalUserId);
        sessionStorage.setItem("access_token", access_token);
        sessionStorage.setItem("refresh_token", refresh_token);
        sessionStorage.setItem("access_expires_time", access_expires_time);
        sessionStorage.setItem("refresh_expires_time", refresh_expires_time);
        sessionStorage.setItem("roles", JSON.stringify(roles));

        // ✅ ตรวจสอบ `company_exist` และ `company_id` ก่อนบันทึก
        console.log("📌 ตรวจสอบ company_exist:", company_exist);
        console.log("📌 ตรวจสอบ company_id:", company_id);

        if (company_exist && company_id) {
            sessionStorage.setItem("company_id", company_id);
            console.log("✅ Company ID saved:", company_id);
        } else {
            console.warn("🚨 No valid Company ID found! Removing from sessionStorage.");
            sessionStorage.removeItem("company_id");
        }

        console.log("🔐 Token & User ID saved successfully!");

        return {
            success: true,
            message,
            user_id: finalUserId,
            access_token,
            refresh_token,
            access_expires_time,
            refresh_expires_time,
            roles,
            company_exist,
            company_id
        };
    } catch (error) {
        // ❌ จัดการข้อผิดพลาด
        const errorMessage = error.response?.data?.message || error.message || "Unknown error occurred";
        console.error("❌ OTP verification failed:", errorMessage);
        throw new Error(`OTP verification failed: ${errorMessage}`);
    }
}
