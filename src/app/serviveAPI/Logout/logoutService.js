// // ✅ ตรวจสอบการ Logout และ Refresh Token ของผู้ใช้
// import axios from "axios";
// import ipconfig from "@/app/ipconfig";
// import Swal from "sweetalert2";

// // ✅ URL API
// const REFRESH_API = `http://${ipconfig.API_HOST}/api/auth/refresh-access-token`;
// const LOGOUT_API = `http://${ipconfig.API_HOST}/api/auth/logout`;

// export async function logoutUser() {
//     let accessToken = localStorage.getItem("access_token");
//     const refreshToken = localStorage.getItem("refresh_token");
//     const userId = localStorage.getItem("user_id");

//     console.log("🔹 `user_id` ที่ใช้สำหรับ Logout:", userId);
//     console.log("🔹 `access_token` ก่อน Logout:", accessToken);
//     console.log("🔹 `refresh_token` ก่อน Logout:", refreshToken);

//     try {
//         // ✅ 1. ตรวจสอบ Access Token โดยเรียก API `/auth/refresh-access-token`
//         console.log("🔄 กำลังตรวจสอบ Access Token...");

//         let newAccessToken = null; // ✅ กำหนดตัวแปรรองรับ Access Token ใหม่
//         const refreshResponse = await axios.post(REFRESH_API, {
//             user_id: userId,
//             access_token: accessToken
//         }, {
//             headers: {
//                 Authorization: `Bearer ${refreshToken}`, // ✅ ใช้ Refresh Token ใน Header
//                 "Content-Type": "application/json"
//             }
//         });

//         console.log("🔄 ✅ Refresh Token Response:", refreshResponse.data);

//         // ✅ ตรวจสอบค่าที่ API ส่งกลับมา
//         const isExpired = refreshResponse.data.hasOwnProperty("is_expired") ? String(refreshResponse.data.is_expired) : "false";
//         const isRevoked = refreshResponse.data.hasOwnProperty("is_revoked") ? !!refreshResponse.data.is_revoked : false;

//         const NewAC = Cookies.set("new_access_token", newAccessToken); // ✅ บันทึก new_access_token ลง Local Storage

//         console.log("🔹 user_status:", refreshResponse.data.user_status);
//         console.log("🔹 is_expired (boolean):", isExpired);
//         console.log("🔹 is_revoked (boolean):", isRevoked);
//         console.log("🔹 new_access_token ที่ได้รับ:", NewAC);

//         // ✅ เงื่อนไขที่ 1: ถ้า `user_status = online` และ `is_expired = "false"`
//         if (refreshResponse.data.user_status === "online" && isExpired === "false") {
//             console.log("✅ Access Token ปัจจุบันยังใช้งานได้ → ใช้ทำ Logout");
//             accessToken = localStorage.getItem("access_token"); // ✅ ใช้ Access Token เดิม
//         }

//         // ✅ เงื่อนไขที่ 2: ถ้ามี `"is_expired": "true", "is_revoked": true` → ใช้ `new_access_token` ทำ Logout
//         else if (isExpired === "true" && isRevoked && newAccessToken) {
//             // ❌ ตรวจสอบว่า new_access_token ไม่ใช่ refresh_token
//             if (newAccessToken === refreshToken) {
//                 console.error("❌ new_access_token ที่ได้รับมาเป็น refresh_token ซึ่งผิดพลาด!");
//                 // 🔹 ลบเฉพาะค่าที่เกี่ยวข้องกับเซสชัน
//                 localStorage.removeItem("access_token");
//                 localStorage.removeItem("refresh_token");
//                 localStorage.removeItem("user_id");
//                 localStorage.removeItem("access_expires_time");
//                 localStorage.removeItem("refresh_expires_time");
//                 localStorage.removeItem("company_id")
//                 // localStorage.clear();
//                 window.location.href = "/";
//                 return;
//             }

//             // ✅ บันทึก Access Token ใหม่ลง Local Storage
//             Cookies.set("access_token", newAccessToken);
//             console.log("✅ อัปเดต new_access_token ใน Local Storage:", newAccessToken);

//             // ✅ ดึงค่าจาก Local Storage มาใช้ใหม่
//             accessToken = localStorage.getItem("new_access_token");
//             console.log("🔄 `access_token` หลังจากอัปเดต:", accessToken);
//         }

//         // ❌ ถ้าไม่มี Access Token ใหม่ → อาจต้องให้ผู้ใช้ Login ใหม่
//         else {
//             console.warn("❌ ไม่มี Access Token ใหม่ → อาจต้องให้ผู้ใช้ Login ใหม่");
//             localStorage.removeItem("access_token");
//             localStorage.removeItem("refresh_token");
//             localStorage.removeItem("user_id");
//             localStorage.removeItem("access_expires_time");
//             localStorage.removeItem("refresh_expires_time");
//             localStorage.removeItem("company_id")
//             // localStorage.clear();
//             await Swal.fire({
//                 title: "เซสชันหมดอายุ",
//                 text: "กรุณาเข้าสู่ระบบใหม่",
//                 icon: "warning",
//                 confirmButtonText: "ตกลง"
//             });
//             window.location.href = "/";
//             return;
//         }

//         // ✅ Debug ค่าก่อนเรียก `/auth/logout`
//         console.log("🚀 เตรียมส่งคำขอ Logout...");
//         console.log("🔹 `user_id` ที่จะใช้:", userId);
//         console.log("🔹 `access_token` ที่จะใช้:", accessToken);

//         // ✅ 2. ส่งคำขอ Logout โดยใช้ Access Token ใหม่ (ถ้ามี)
//         try {
//             const logoutResponse = await axios.post(LOGOUT_API, { user_id: userId }, {
//                 headers: {
//                     Authorization: `${accessToken}`,
//                     "Content-Type": "application/json"
//                 }
//             });

//             console.log("✅ Logout API Response:", logoutResponse.data);
//             if (logoutResponse?.data?.status === "logged_out") {
//                 console.log("✅ Debug: logoutResponse.data:", logoutResponse.data);

//                 const logoutMessage = logoutResponse?.data?.message || "คุณถูกออกจากระบบแล้ว";
//                 console.log("✅ Logout Message:", logoutMessage);

//                 await Swal.fire({
//                     title: "ออกจากระบบสำเร็จ!",
//                     text: logoutMessage,
//                     icon: "success",
//                     confirmButtonText: "ตกลง"
//                 });

//                 // ✅ เคลียร์ Local Storage
//                 localStorage.removeItem("access_token");
//                 localStorage.removeItem("refresh_token");
//                 localStorage.removeItem("user_id");
//                 localStorage.removeItem("access_expires_time");
//                 localStorage.removeItem("refresh_expires_time");
//                 localStorage.removeItem("company_id");
//                 window.location.href = "/";

//             } else {
//                 throw new Error("❌ Logout failed: Unexpected response.");
//             }

//         } catch (logoutError) {
//             console.error("❌ Logout API Error:", logoutError);

//             // ✅ ตรวจสอบว่ามี response หรือไม่
//             let errorMessage = "เกิดข้อผิดพลาด ไม่สามารถออกจากระบบได้";

//             if (logoutError.response) {
//                 console.log("🔹 logoutError.response:", logoutError.response); // ตรวจสอบ response
//                 if (logoutError.response.data) {
//                     console.log("🔹 logoutError.response.data:", logoutError.response.data); // ตรวจสอบ data
//                     errorMessage = logoutError.response.data.message || errorMessage;
//                 }
//             } else {
//                 console.warn("❌ ไม่มี response จาก API อาจเกิดจากปัญหาทางเครือข่าย");
//                 errorMessage = logoutError.message || errorMessage; // ใช้ข้อความจาก axios error
//             }

//             await Swal.fire({
//                 title: "เกิดข้อผิดพลาด",
//                 text: errorMessage,
//                 icon: "error",
//                 confirmButtonText: "ตกลง"
//             });
//         }
//     } catch (error) {
//         console.error("❌ Error refreshing Access Token:", error.response?.data || error.message);
//         throw error.response?.data || { message: "Failed to refresh Access Token" };
//     }
// }

// ✅ ตรวจสอบการ Logout และ Refresh Token ของผู้ใช้
import axios from "axios";
import ipconfig from "@/app/ipconfig";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

// ✅ URL API
const REFRESH_API = `http://${ipconfig.API_HOST}/api/auth/refresh-access-token`;
const LOGOUT_API = `http://${ipconfig.API_HOST}/api/auth/logout`;

export async function logoutUser() {
    let accessToken = Cookies.get("access_token");
    const refreshToken = Cookies.get("refresh_token");
    const userId = Cookies.get("user_id");

    console.log("🔹 `user_id` ที่ใช้สำหรับ Logout:", userId);
    console.log("🔹 `access_token` ก่อน Logout:", accessToken);
    console.log("🔹 `refresh_token` ก่อน Logout:", refreshToken);

    try {
        // ✅ 1. ตรวจสอบ Access Token โดยเรียก API `/auth/refresh-access-token`
        console.log("🔄 กำลังตรวจสอบ Access Token...");

        let newAccessToken = null; // ✅ กำหนดตัวแปรรองรับ Access Token ใหม่
        const refreshResponse = await axios.post(REFRESH_API, {
            user_id: userId,
            access_token: accessToken
        }, {
            headers: {
                Authorization: `Bearer ${refreshToken}`,
                "Content-Type": "application/json"
            }
        });

        console.log("🔄 ✅ Refresh Token Response:", refreshResponse.data);

        // ✅ ตรวจสอบค่าที่ API ส่งกลับมา
        const isExpired = refreshResponse.data?.is_expired ? String(refreshResponse.data.is_expired) : "false";
        const isRevoked = refreshResponse.data?.is_revoked ? !!refreshResponse.data.is_revoked : false;

        
        console.log("🔹 user_status:", refreshResponse.data.user_status);
        console.log("🔹 is_expired (boolean):", isExpired);
        console.log("🔹 is_revoked (boolean):", isRevoked);
        console.log("🔹 new_access_token ที่ได้รับ:", newAccessToken);

        if (refreshResponse.data.user_status === "online" && isExpired === "false") {
            console.log("✅ Access Token ปัจจุบันยังใช้งานได้ → ใช้ทำ Logout");
            accessToken = Cookies.get("access_token");
        } else if (isExpired === "true" && isRevoked && newAccessToken) {
            if (newAccessToken === refreshToken) {
                console.error("❌ new_access_token ที่ได้รับมาเป็น refresh_token ซึ่งผิดพลาด!");
                clearSession();
                return;
            }
            Cookies.set("access_token", newAccessToken);
            console.log("✅ อัปเดต new_access_token ใน Local Storage:", newAccessToken);
            accessToken = newAccessToken;
        } else {
            console.warn("❌ ไม่มี Access Token ใหม่ → อาจต้องให้ผู้ใช้ Login ใหม่");
            clearSession();
            await Swal.fire({
                title: "เซสชันหมดอายุ",
                text: "กรุณาเข้าสู่ระบบใหม่",
                icon: "warning",
                confirmButtonText: "ตกลง"
            });
            return;
        }

        console.log("🚀 เตรียมส่งคำขอ Logout...");
        console.log("🔹 `user_id` ที่จะใช้:", userId);
        console.log("🔹 `access_token` ที่จะใช้:", accessToken);

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

            console.log("✅ Logout API Response:", logoutResponse.data);

            // ✅ ตรวจสอบว่ามีข้อมูลก่อนเข้าถึง message
            if (logoutResponse && logoutResponse.data) {
                console.log("🔹 Message from API:", logoutResponse.data.message);
            } else {
                console.error("❌ logoutResponse หรือ logoutResponse.data เป็น undefined!");
            }

            // ✅ ออกจากระบบสำเร็จ → เคลียร์ Local Storage
            clearSession();

            await Swal.fire({
                title: "ออกจากระบบสำเร็จ!",
                icon: "success",
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
            });

        } catch (logoutError) {
            console.error("❌ Logout API Error:", logoutError);

            // ✅ ตรวจสอบว่ามี response จาก error หรือไม่
            if (logoutError.response && logoutError.response.data) {
                console.error("🔹 Error Message:", logoutError.response.data.message);
            } else {
                console.error("❌ logoutError.response หรือ logoutError.response.data เป็น undefined!");
            }

            await Swal.fire({
                title: "เกิดข้อผิดพลาด",
                text: "ไม่สามารถออกจากระบบได้ กรุณาลองใหม่",
                icon: "error",
                confirmButtonText: "ตกลง"
            });
        }

    } catch (error) {
        console.error("❌ Error refreshing Access Token:", error);
        await Swal.fire({
            title: "เกิดข้อผิดพลาด",
            text: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาลองใหม่",
            icon: "error",
            confirmButtonText: "ตกลง"
        });
    }
}

// ✅ ฟังก์ชันเคลียร์ข้อมูล Session พร้อมหน่วงเวลา 3 วินาที
function clearSession() {
    console.log("🔹 เคลียร์ Local Storage และ Redirect... (รอ 3 วินาที)");

    // ✅ เคลียร์ข้อมูล Local Storage
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    Cookies.remove("user_id");
    Cookies.remove("access_expires_time");
    Cookies.remove("refresh_expires_time");
    Cookies.remove("company_id");
    Cookies.remove("ozone_data");
    Cookies.remove("roles");
    Cookies.remove("ch2o_data");

    // ✅ หน่วงเวลา 2 วินาทีก่อน Redirect ไปหน้า Login
    setTimeout(() => {
        window.location.href = "/";
    }, 2000);
}



