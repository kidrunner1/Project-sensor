// TEST LOGOUT
// import axios from "axios";
// import ipconfig from "@/app/ipconfig";
// import Swal from "sweetalert2";

// // ✅ URL API
// // const REFRESH_API = `https://${ipconfig.API_HOST}/api/auth/refresh-access-token`;
// const LOGOUT_API = `https://${ipconfig.API_HOST}/api/auth/logout`;

// export async function logoutUser() {
//     const accessToken = sessionStorage.getItem("access_token");
//     const userId = sessionStorage.getItem("user_id");

// console.log("🔹 `user_id` ที่ใช้สำหรับ Logout:", userId);
// console.log("🔹 `access_token` ก่อน Logout:", accessToken);

// if (!accessToken || !userId) {
//     console.warn("❌ ไม่พบ Access Token หรือ User ID → เคลียร์เซสชันและกลับไปหน้า Login");
//     clearSession();
//     return;
// }

// console.log("🚀 เตรียมส่งคำขอ Logout...");

//     try {
//         const logoutResponse = await axios.post(
//             LOGOUT_API,
//             { user_id: userId },
//             {
//                 headers: {
//                     Authorization: `${accessToken}`,
//                     "Content-Type": "application/json"
//                 }
//             }
//         );

//         const data = logoutResponse?.data; // ✅ ดึงข้อมูลที่ได้รับมา
//         console.log("✅ Logout API Response:", data);

//         clearSession();
//         await Swal.fire({
//             text: data.message,
//             icon: "success",
//             toast: true,
//             position: "top-end",
//             showConfirmButton: false,
//             timer: 2000,
//             timerProgressBar: true,
//         });

//     } catch (logoutError) {
//         console.error("❌ Logout API Error:", logoutError);

//         await Swal.fire({
//             title: "เกิดข้อผิดพลาด",
//             text: "ไม่สามารถออกจากระบบได้ กรุณาลองใหม่",
//             icon: "error",
//             confirmButtonText: "ตกลง"
//         });
//     }
// }

// // ✅ ฟังก์ชันเคลียร์ข้อมูล Session พร้อมหน่วงเวลา 3 วินาที
// function clearSession() {
//     console.log("🔹 เคลียร์ SessionStorage และ Redirect...");

//     sessionStorage.clear(); // ✅ ล้างข้อมูลทั้งหมด

//     // ✅ หน่วงเวลา 2 วินาทีก่อน Redirect ไปหน้า Login
//     setTimeout(() => {
//         window.location.href = "/";
//     }, 2000);
// }

import axios from "axios";
import ipconfig from "@/app/ipconfig";
import Swal from "sweetalert2";

const LOGOUT_API = `https://${ipconfig.API_HOST}/api/auth/logout`;

export async function logoutUser() {
    const accessToken = sessionStorage.getItem("access_token");
    const userId = sessionStorage.getItem("user_id");

    console.log("🔹 `user_id` ที่ใช้สำหรับ Logout:", userId);
    console.log("🔹 `access_token` ก่อน Logout:", accessToken);

    if (!accessToken || !userId) {
        console.warn("❌ ไม่พบ Access Token หรือ User ID → เคลียร์เซสชันและกลับไปหน้า Login");
        clearSession();
        return;
    }

    console.log("🚀 เตรียมส่งคำขอ Logout...");

    try {
        const logoutResponse = await axios.post(
            LOGOUT_API,
            { user_id: userId },
            {
                headers: {
                    Authorization: `${accessToken}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const data = logoutResponse?.data || {};

        await Swal.fire({
            text: "ออกจากระบบสำเร็จ",
            icon: "success",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
        });

        clearSession();
        return;

    } catch (error) {
        console.error("❌ Logout API Error:", error);

        await Swal.fire({
            title: "เกิดข้อผิดพลาด",
            text: "ไม่สามารถออกจากระบบได้ กรุณาลองใหม่",
            icon: "error",
            confirmButtonText: "ตกลง"
        });

        throw error; // ✅ ส่ง error ออกไปให้ handle ต่อด้านนอกถ้าต้องการ
    }
}


// ✅ ฟังก์ชันเคลียร์ข้อมูล Session และ Redirect หลัง delay
function clearSession() {
    console.log("🔹 เคลียร์ SessionStorage และ Redirect...");
    sessionStorage.clear();

    // ✅ รอ 1.5 วิ ค่อย redirect
    setTimeout(() => {
        window.location.href = "/";
    }, 1500);
}



