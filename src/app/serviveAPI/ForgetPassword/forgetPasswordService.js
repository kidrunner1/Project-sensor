import axios from "axios";
import ipconfig from "@/app/ipconfig";
import Cookies from "js-cookie";

// ✅ URL API
const FORGET_PASSWORD_API = `http://${ipconfig.API_HOST}/api/auth/forget-password`;
const VERIFY_OTP_API = `http://${ipconfig.API_HOST}/api/auth/verify-otp-forget-password`;
const RESET_PASSWORD_API = `http://${ipconfig.API_HOST}/api/auth/reset-password-forget-password`;

/**
 * 🔹 1. ขอ OTP ไปยังอีเมล
 * @param {string} email
 * @returns {Promise<Object>} API Response
 */
export async function requestForgetPassword(email) {
    try {
        const response = await axios.post(FORGET_PASSWORD_API, { email });
        console.log("✅ OTP Request Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Request Forget Password Error:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "ไม่สามารถขอ OTP ได้");
    }
}

/**
 * 🔹 2. ยืนยัน OTP และบันทึกข้อมูลลง Local Storage
 * @param {string} userId
 * @param {string} otp
 * @returns {Promise<Object>} API Response
 */
export async function verifyForgetOtp(userId, otp) {
    try {
        const response = await axios.post(VERIFY_OTP_API, {
            user_id: userId,
            otp
        });

        console.log("✅ Verify OTP Response:", response.data);

        // ✅ บันทึก `user_id` และ `otp` ลง Local Storage เพื่อใช้ใน Reset Password
        Cookies.set("forgot_user_id", response.data.user_id);
        Cookies.set("forgot_otp", otp);

        return response.data;
    } catch (error) {
        console.error("❌ Verify OTP Error:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "OTP ไม่ถูกต้อง");
    }
}


/**
 * 🔹 3. รีเซ็ตรหัสผ่านใหม่
 * @param {string} newPassword
 * @returns {Promise<Object>} API Response
 */
export async function resetForgetPassword(newPassword) {
    const userId = localStorage.getItem("forgot_user_id");
    const otp = localStorage.getItem("forgot_otp");

    if (!userId || !otp) {
        throw new Error("❌ ไม่พบข้อมูล `user_id` หรือ `otp` กรุณาขอ OTP ใหม่");
    }

    try {
        const response = await axios.post(RESET_PASSWORD_API, {
            user_id: userId,
            otp: otp,
            new_password: newPassword
        });

        console.log("✅ Reset Password Response:", response.data);

        // ✅ ลบข้อมูล `user_id` และ `otp` ออกจาก Local Storage หลังจากเปลี่ยนรหัสผ่านสำเร็จ
        localStorage.removeItem("forgot_user_id");
        localStorage.removeItem("forgot_otp");

        return response.data;
    } catch (error) {
        console.error("❌ Reset Password Error:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "ไม่สามารถเปลี่ยนรหัสผ่านได้");
    }
}

