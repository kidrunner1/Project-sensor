import axios from "axios";
import ipconfig from "@/app/ipconfig";

const GETUSER_API = `http://${ipconfig.API_HOST}/api/auth/get-user`

export const getUserData = async (userId) => {
    try {
        const accessToken = sessionStorage.getItem("access_token");

        if (!accessToken) {
            throw new Error("Access token not found.");
        }

        const response = await axios.post(
            GETUSER_API,
            { user_id: userId },
            {
                headers: {
                    Authorization: accessToken, //ใส่ Token ใน Header 
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error fetching user data:", error.message);
        throw error; // ส่ง Error ออกไปให้ Handle ต่อใน Component ที่เรียกใช้
    }
};