'use client';
import { useState } from "react";
import { requestForgetPassword, verifyForgetOtp } from "@/app/serviveAPI/ForgetPassword/forgetPasswordService";
import Swal from "sweetalert2";
import { useRouter } from 'next/navigation';

export default function ForgetPasswordForm() {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(Array(6).fill(""));
    const [otpVerified, setOtpVerified] = useState(false);
    const [step, setStep] = useState(1);
    const [userId, setUserId] = useState(null);
    const router = useRouter()

    // ✅ 1. ขอ OTP
    const handleRequestOtp = async () => {
        if (!email) {
            Swal.fire({ title: "กรุณากรอกอีเมล", text: "ช่องอีเมลต้องไม่เว้นว่าง", icon: "warning", confirmButtonText: "ตกลง" });
            return;
        }

        try {
            const response = await requestForgetPassword(email);
            Swal.fire({ title: "OTP ถูกส่งแล้ว!", text: "โปรดตรวจสอบอีเมลของคุณ", icon: "success", confirmButtonText: "ตกลง" });

            setUserId(response.user_id);
            localStorage.setItem("forgot_user_id", response.user_id); // ✅ บันทึก user_id
            setStep(2);
        } catch (error) {
            Swal.fire({ title: "เกิดข้อผิดพลาด", text: error.message, icon: "error", confirmButtonText: "ตกลง" });
        }
    };

    // ✅ 2. ฟังก์ชันตรวจสอบ OTP
    const handleVerifyOtp = async () => {
        const otpString = otp.join(""); // ✅ แปลงอาร์เรย์ OTP เป็นสตริง

        if (otpString.length < 6) {
            Swal.fire({ title: "OTP ไม่ครบ", text: "กรุณากรอกให้ครบ 6 หลัก", icon: "warning", confirmButtonText: "ตกลง" });
            return;
        }

        try {
            const storedUserId = localStorage.getItem("forgot_user_id"); // ✅ ดึง user_id จาก localStorage

            if (!storedUserId) {
                Swal.fire({ title: "เกิดข้อผิดพลาด", text: "ไม่พบข้อมูลผู้ใช้ กรุณาขอ OTP ใหม่", icon: "error", confirmButtonText: "ตกลง" });
                setStep(1);
                return;
            }

            const response = await verifyForgetOtp(storedUserId, otpString); // ✅ ส่ง OTP ที่แปลงเป็น String

            Swal.fire({ title: "ยืนยัน OTP สำเร็จ!", text: "กำลังนำคุณไปตั้งค่ารหัสผ่านใหม่...", icon: "success", confirmButtonText: "ตกลง" });

            setOtpVerified(true);
            localStorage.setItem("forgot_otp", otpString); // ✅ บันทึก OTP ที่ผ่านแล้ว
            window.location.href = "/ResetPassword"; // ✅ ไปที่ Reset Password
        } catch (error) {
            Swal.fire({ title: "OTP ไม่ถูกต้อง", text: "กรุณาตรวจสอบรหัส OTP อีกครั้ง", icon: "error", confirmButtonText: "ลองอีกครั้ง" });
        }
    };

    return (

        <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
            {/* Step 1: ขอ OTP */}
            {step === 1 && (
                <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center border border-gray-200">

                    {/* ไอคอนด้านบน */}

                    <div className='flex flex-col items-center'>
                        <img src="/images/OTP.png" alt="OTP Icon" className='w-16 h-16' />
                        <h2 className='text-xl font-bold mt-3 text-zinc-900'>
                            รีเซ็ตรหัสผ่านของคุณ</h2>
                        <p className="text-gray-500 text-sm mt-1 mb-2">
                            กรอกที่อยู่อีเมลที่คุณใช้ในการลงทะเบียน
                        </p>
                    </div>

                    {/* ช่องกรอกอีเมล */}
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md mb-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="อีเมลของผู้ใช้งาน"
                    />
                    {/* ปุ่ม Actions */}
                    <div className="flex justify-between">
                        <button
                            onClick={() => router.push('/')}
                            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-full bg-gray-100 hover:bg-gray-200 transition-all"
                        >
                            กลับไปหน้าล็อคอิน
                        </button>
                        <button
                            onClick={handleRequestOtp}
                            className="relative border-2 border-zinc-800 text-zinc-800 rounded-full px-8  py-2 font-semibold hover:bg-zinc-800 hover:text-white transition-all duration-300 group overflow-hidden shadow-md"
                        >
                            ส่งคำขอ OTP
                        </button>
                    </div>
                </div>
            )}

            {/* Step 2: Verify OTP */}
            {step === 2 && (
                <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center border border-gray-200">
                    <div className="flex flex-col items-center gap-4 my-4 ">
                        {/* ไอคอนด้านบน */}
                        <div className='flex flex-col items-center'>
                            <img src="/images/OTP.png" alt="OTP Icon" className='w-16 h-16' />
                            <h2 className='text-xl font-bold mt-3 text-zinc-900'>ยืนยันที่อยู่อีเมลของคุณ</h2>
                            <p className="text-gray-500 text-sm mt-1">
                                เราได้ส่งรหัส OTP ไปยังอีเมลของคุณ โปรดกรอกเพื่อดำเนินการต่อ.
                            </p>
                        </div>
                        <h2 className="text-lg font-bold text-gray-900 ">กรอกรหัส OTP</h2>

                        {/* ช่องกรอก OTP 6 หลัก */}
                        <div className="flex justify-center gap-2 ">
                            {otp.map((num, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength={1}
                                    value={num}
                                    onChange={(e) => {
                                        const newOtp = [...otp];
                                        newOtp[index] = e.target.value;
                                        setOtp(newOtp);
                                        // ✅ เลื่อนโฟกัสไปช่องถัดไปอัตโนมัติ
                                        if (e.target.value && index < 5) {
                                            document.getElementById(`otp-${index + 1}`)?.focus();
                                        }
                                    }}
                                    id={`otp-${index}`}
                                    className="w-12 h-12 border border-gray-300 rounded-lg text-center text-lg font-bold
                                               focus:ring-2 focus:ring-green-500 focus:outline-none transition-all duration-300"
                                />
                            ))}
                        </div>
                        {/* ปุ่มยืนยัน OTP */}
                        <button
                            onClick={handleVerifyOtp}
                            className="mt-5 text-zinc-900 border-2 border-zinc-800 rounded-full px-8 md:px-12 py-2 font-semibold hover:bg-zinc-900 hover:text-white">
                            ยืนยัน OTP
                        </button>
                    </div>
                </div>
            )}
        </div>

    );
}
