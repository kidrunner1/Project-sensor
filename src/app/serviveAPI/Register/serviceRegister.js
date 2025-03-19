// import axios from "axios";
// import ipconfig from "@/app/ipconfig";

// // คลาสที่ใช้จัดการข้อมูลลงทะเบียน
// class UserRegister {
//     constructor(name, email, phone, password, username, registrationMethod, avatar, status) {
//         this.name = name;
//         this.email = email;
//         this.phone = phone;
//         this.password = password;
//         this.username = username;
//         this.registrationMethod = registrationMethod;
//         this.avatar = avatar;
//         this.status = status;
//     }
// }

// // URL สำหรับการเรียก API ลงทะเบียน
// const API_URL = `http://${ipconfig.API_HOST}/api/users/register`;

// // ✅ ฟังก์ชันสำหรับลงทะเบียนผู้ใช้ "ธรรมดา"
// export async function registerUser(name, email, phone, password, username) {
//     const userData = new UserRegister(name, email, phone, password, username, "manual", "", "");

//     try {
//         const response = await axios.post(API_URL, {
//             name: userData.name,
//             email: userData.email,
//             phone: userData.phone,
//             password: userData.password,
//             username: userData.username,
//             registration_method: userData.registrationMethod,
//             avatar: userData.avatar,
//             status: userData.status,
//         });

//         return response.data;
//     } catch (error) {
//         throw new Error("Registration failed: " + (error.response?.data?.message || error.message));
//     }
// }

// // ✅ ฟังก์ชันสำหรับลงทะเบียนผู้ใช้ผ่าน Google OAuth (แยกต่างหาก)
// export async function registerUserWithGoogle(user) {
//     const userData = new UserRegister(user.name || "", user.email, user.phone || "", "@GoogleAuth", user.username, "google_oauth", user.avatar || "", "");

//     try {
//         const response = await axios.post(API_URL, {
//             name: userData.name,
//             email: userData.email,
//             phone: userData.phone,
//             password: userData.password,
//             username: userData.username,
//             registration_method: userData.registrationMethod,
//             avatar: userData.avatar,
//             status: userData.status,
//         });

//         return response.data;
//     } catch (error) {
//         throw new Error("Google OAuth registration failed: " + (error.response?.data?.message || error.message));
//     }
// }


import axios from "axios";
import ipconfig from "@/app/ipconfig";

class UserRegister {
    constructor(name, email, phone, password, username, avatar = "", status = "unspecified") {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.username = username;
        this.avatar = avatar;
        this.status = status;
    }
}

const API_URL = `http://${ipconfig.API_HOST}/api/auth/register`;

export async function registerUser(name, email, phone, password, username) {
    const userData = { name, email, phone, password, username };

    try {
        const response = await axios.post(API_URL, userData);
        return response.data.user; // ✅ คืนค่าเฉพาะข้อมูล user
    } catch (error) {
        const apiError = error.response?.data?.error;

        if (apiError === "Weak password") {
            throw new Error("รหัสผ่านไม่ปลอดภัย กรุณาใช้อักขระพิเศษ และตัวเลข");
        }

        if (apiError === "Email or phone already exists") {
            throw new Error("อีเมลหรือเบอร์โทรศัพท์นี้มีการใช้งานแล้ว");
        }

        // Default
        throw new Error(error.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก");
    }
}



