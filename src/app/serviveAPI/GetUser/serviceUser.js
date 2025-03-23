// import axios from "axios";
// import ipconfig from "@/app/ipconfig";

// const GETUSER_API = `http://${ipconfig.API_HOST}/api/auth/get-user`

// export const getUserData = async (userId) => {
//     try {
//         const accessToken = sessionStorage.getItem("access_token");

//         if (!accessToken) {
//             throw new Error("Access token not found.");
//         }

//         const response = await axios.post(
//             GETUSER_API,
//             { user_id: userId },
//             {
//                 headers: {
//                     Authorization: accessToken, //ใส่ Token ใน Header 
//                     "Content-Type": "application/json",
//                 },
//             }
//         );

//         return response.data;
//     } catch (error) {
//         console.error("Error fetching user data:", error.message);
//         throw error; // ส่ง Error ออกไปให้ Handle ต่อใน Component ที่เรียกใช้
//     }
// };

import { create } from "zustand";
import axios from "axios";
import ipconfig from "@/app/ipconfig";

const GETUSER_API = `http://${ipconfig.API_HOST}/api/auth/get-user`;
const UPDATEUSER_API = `http://${ipconfig.API_HOST}/api/auth/update-user`;

export const useUserStore = create((set) => ({
    user: null,
    loading: false,
    error: null,

    fetchUserData: async (userId) => {
        try {
            set({ loading: true, error: null });

            const accessToken = sessionStorage.getItem("access_token");
            if (!accessToken) throw new Error("Access token not found.");

            const response = await axios.post(
                GETUSER_API,
                { user_id: userId },
                {
                    headers: {
                        Authorization: accessToken,
                        "Content-Type": "application/json",
                    },
                }
            );

            set({ user: response.data, loading: false });
        } catch (error) {
            console.error("Error fetching user data:", error.message);
            set({ error: error.message, loading: false });
        }
    },

    updateUserData: async (updates) => {
        try {
            const accessToken = sessionStorage.getItem("access_token");
            if (!accessToken) throw new Error("Access token not found.");

            await axios.post(
                UPDATEUSER_API,
                updates,
                {
                    headers: {
                        Authorization: accessToken,
                        "Content-Type": "application/json",
                    },
                }
            );

            set((state) => ({
                user: { ...state.user, ...updates },
            }));
        } catch (error) {
            console.error("Error updating user data:", error.message);
            set({ error: error.message });
        }
    },

    updateProfileImage: (imageUrl) => {
        set((state) => ({
            user: { ...state.user, avatar: imageUrl },
        }));
    },

    clearUser: () => set({ user: null, error: null }),
}));

