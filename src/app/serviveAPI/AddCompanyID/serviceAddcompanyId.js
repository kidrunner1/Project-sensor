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

    return response.data; // ส่งข้อมูลที่ได้กลับไป
  } catch (error) {
    console.error("Error adding company ID:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to add company ID" };
  }
};
