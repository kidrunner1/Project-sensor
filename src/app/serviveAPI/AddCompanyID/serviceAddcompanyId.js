import axios from "axios";
import ipconfig from "@/app/ipconfig";

const ADD_COMPANY_ID_API = `http://${ipconfig.API_HOST}/api/auth/add-company-id`;

/**
 * ส่งคำขอ Add Company ID ไปยัง API
 * @param {string} userId - ID ของผู้ใช้
 * @param {string} companyId - ID ของบริษัทที่ต้องการเพิ่ม
 * @param {string} accessToken - Access Token ของผู้ใช้ (หลังจาก verify OTP สำเร็จ)
 * @param {string} refreshToken - Refresh Token ของผู้ใช้
 */
export const addCompanyId = async (userId, companyId, accessToken, refreshToken) => {
  try {
    console.log("🚀 เรียก API Add Company ID...");
    console.log("🔹 `user_id`:", userId);
    console.log("🔹 `company_id`:", companyId);
    console.log("🔹 `access_token` ก่อนส่ง:", accessToken);
    console.log("🔹 `refresh_token` ที่ใช้ใน Header:", refreshToken);

    // ✅ เรียก API `add-company-id`
    const response = await axios.post(
      ADD_COMPANY_ID_API,
      {
        user_id: userId,
        company_id: companyId,
        access_token: accessToken,
      },
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ API Response:", response.data);

    // ✅ ตรวจสอบว่ามี `new_access_token` ส่งกลับมาหรือไม่
    const newAccessToken = response.data.new_access_token || accessToken;
    const companyIdFromAPI = response.data.company_id || companyId;

    console.log("🔹 `new_access_token` ที่ได้จาก API:", newAccessToken || "❌ ไม่มีการอัปเดต Access Token");
    console.log("🔹 `company_id` ที่ได้รับ:", companyIdFromAPI);

    // ✅ อัปเดตค่าใน Local Storage
    sessionStorage.setItem("access_token", newAccessToken);
    sessionStorage.setItem("company_id", companyIdFromAPI);
    console.log("✅ บันทึก Access Token และ Company ID ลง Local Storage สำเร็จ!");

    return response.data;
  } catch (error) {
    console.error("❌ Error adding company ID:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to add company ID" };
  }
};
