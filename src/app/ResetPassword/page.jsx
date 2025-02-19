'use client';
import { useState, useEffect } from "react";
import { resetForgetPassword } from "@/app/serviveAPI/ForgetPassword/forgetPasswordService";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function ResetPasswordPage() {
    const [otp, setOtp] = useState(Array(6).fill(""));
    const [otpVerified, setOtpVerified] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userId, setUserId] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const storedUserId = localStorage.getItem("forgot_user_id");
        const storedOtp = localStorage.getItem("forgot_otp");

        if (!storedUserId || !storedOtp) {
            Swal.fire({
                title: "เกิดข้อผิดพลาด",
                text: "ไม่พบข้อมูล กรุณาขอ OTP ใหม่",
                icon: "error",
                confirmButtonText: "ตกลง"
            }).then(() => {
                router.push("/forget-password");
            });
        } else {
            setUserId(storedUserId);
            setOtp(storedOtp.split("")); // แยก OTP เป็น Array
            setOtpVerified(true); // ✅ จำลองว่า OTP ถูกต้อง
        }
    }, []);

    // ✅ ตรวจสอบรหัสผ่านแบบ Real-time
    const passwordChecks = {
        hasLowercase: /[a-z]/.test(newPassword),
        hasUppercase: /[A-Z]/.test(newPassword),
        hasNumber: /\d/.test(newPassword),
        hasMinLength: newPassword.length >= 8
    };

    const isPasswordValid = Object.values(passwordChecks).every(Boolean);

    // ✅ ฟังก์ชันเปลี่ยนรหัสผ่าน
    const handleResetPassword = async () => {
        if (!isPasswordValid || newPassword !== confirmPassword) {
            Swal.fire({ title: "เกิดข้อผิดพลาด", text: "รหัสผ่านไม่ถูกต้อง", icon: "warning", confirmButtonText: "ตกลง" });
            return;
        }

        try {
            await resetForgetPassword(newPassword);
            Swal.fire({
                title: "เปลี่ยนรหัสผ่านสำเร็จ!",
                text: "เข้าสู่ระบบด้วยรหัสผ่านใหม่ได้เลย",
                icon: "success",
                confirmButtonText: "ไปที่ Login"
            }).then(() => {
                localStorage.removeItem("forgot_user_id");
                localStorage.removeItem("forgot_otp");
                router.push("/");
            });
        } catch (error) {
            Swal.fire({ title: "ผิดพลาด", text: error.message, icon: "error", confirmButtonText: "ลองอีกครั้ง" });
        }
    };

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
                <h2 className="text-xl font-bold mb-4">รีเซ็ตรหัสผ่าน</h2>
                <p className="text-gray-500 text-sm mb-3">

                ตรวจสอบความถูกต้องของ OTP  
                </p>

                {/* OTP Input */}
                <div className="flex justify-center gap-2 my-4">
                    {otp.map((num, index) => (
                        <input
                            key={index}
                            type="text"
                            value={num}
                            maxLength={1}
                            disabled
                            className="w-10 h-10 border rounded-md text-center text-lg font-bold bg-gray-200 text-gray-600"
                        />
                    ))}
                </div>

                {otpVerified ? (
                    <p className="text-green-500 text-sm font-medium">✔ ตรวจสอบรหัสแล้ว</p>
                ) : (
                    <p className="text-red-500 text-sm font-medium">✖ รหัส OTP ไม่ถูกต้อง</p>
                )}

                {/* New Password Input */}
                <div className="mt-4 relative">
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full p-2 border rounded-md"
                        placeholder="รหัสผ่านใหม่
"
                    />
                </div>

                {/* Password Strength Rules */}
                <div className="text-left mt-3 text-sm">
                    <p className={`${passwordChecks.hasLowercase ? "text-green-500" : "text-gray-400"}`}>✔
                        อักษรตัวพิมพ์เล็กอย่างน้อยหนึ่งตัว</p>
                    <p className={`${passwordChecks.hasMinLength ? "text-green-500" : "text-gray-400"}`}>✔ ขั้นต่ำ 8 ตัวอักษร</p>
                    <p className={`${passwordChecks.hasUppercase ? "text-green-500" : "text-gray-400"}`}>✔ อักษรตัวพิมพ์ใหญ่อย่างน้อยหนึ่งตัว</p>
                    <p className={`${passwordChecks.hasNumber ? "text-green-500" : "text-gray-400"}`}>✔
                        อย่างน้อยหนึ่งหมายเลข</p>
                </div>

                {/* Confirm Password */}
                <div className="mt-4 relative">
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-2 border rounded-md"
                        placeholder="ยืนยันรหัสผ่านใหม่"
                    />
                </div>

                {/* Buttons */}
                <div className="flex justify-between mt-6">
                    <button
                        onClick={() => router.push("/ForgotPassword")}
                        className="bg-gray-300 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-400"
                    >
                        ยกเลิก
                    </button>
                    <button
                        onClick={handleResetPassword}
                        disabled={!isPasswordValid}
                        className={`px-4 py-2 rounded-md text-white ${isPasswordValid ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"}`}
                    >
                        ยืนยันรหัสผ่านใหม่
                    </button>
                </div>
            </div>
        </div>
    );
}
