'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/app/serviveAPI/Login/serviceLogin';
import Swal from 'sweetalert2';
import { verifyOtp } from '@/app/serviveAPI/OTP/otpService'; // นำเข้า verifyOtp
import Link from 'next/link';
import { FaEnvelope, FaGoogle } from "react-icons/fa";
import { MdLockOutline } from "react-icons/md";
import dynamic from 'next/dynamic';
import InputField from './components/InputField';
import Cookies from "js-cookie";

// ✅ โหลด Lottie JSON เมื่อใช้ Client-Side เท่านั้น
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });
import loadingAnimation from '@/app/animations/loading.json';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(Array(6).fill("")); // ✅ เก็บ OTP เป็นอาร์เรย์ 6 ช่อง
  const [loading, setLoading] = useState(false);
  const [otpRequired, setOtpRequired] = useState(false);
  const [userId, setUserId] = useState(null);
  const [errors, setErrors] = useState({ identifier: '', password: '', login: '' });
  const [expiresAt, setExpiresAt] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserId = Cookies.get('user_id');
      if (storedUserId) {
        console.log("✅ พบ `user_id` ใน Local Storage:", storedUserId);
        router.push('/MainDashboard');
      }
    }
  }, []);

  // ✅ ฟังก์ชันตรวจสอบ Validation
  const validateInputs = () => {
    const newErrors = {};
    if (!identifier.trim()) {
      newErrors.identifier = "กรุณากรอกชื่อผู้ใช้หรืออีเมล";
    } else if (!/^[a-zA-Z0-9@.]+$/.test(identifier)) {
      newErrors.identifier = "ชื่อผู้ใช้ต้องเป็น A-Z, a-z, 0-9 หรืออีเมลเท่านั้น";
    }
    if (!password.trim()) {
      newErrors.password = "กรุณากรอกรหัสผ่าน";
    } else if (password.length < 6) {
      newErrors.password = "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateInputs()) {
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: "กรุณากรอกข้อมูลให้ถูกต้อง",
        icon: "warning",
        confirmButtonText: "ตกลง"
      });
      setLoading(false);
      return;
    }

    try {
      const loginResponse = await loginUser(identifier, password);
      if (loginResponse?.success) {
        setExpiresAt(loginResponse.expiresAt);

        if (loginResponse.otpRequired) {
          setOtpRequired(true);
          setUserId(loginResponse.userId);

          Swal.fire({
            title: 'กรุณากรอก OTP',
            text: 'ระบบต้องการ OTP เพื่อยืนยันตัวตน',
            icon: 'info',
            confirmButtonText: 'ตกลง'
          });
        } else {
          Cookies.set('user_id', loginResponse.userId);

          Swal.fire({
            title: 'เข้าสู่ระบบสำเร็จ!',
            text: 'ยินดีต้อนรับกลับ!',
            icon: 'success',
            confirmButtonText: 'ตกลง'
          }).then(() => {
            router.push('/MainDashboard');
          });
        }
      } else {
        Swal.fire({
          title: 'เข้าสู่ระบบไม่สำเร็จ',
          text: 'กรุณาตรวจสอบข้อมูลของคุณอีกครั้ง',
          icon: 'error',
          confirmButtonText: 'ตกลง'
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'เกิดข้อผิดพลาด',
        text: error.message || 'ไม่สามารถเข้าสู่ระบบได้',
        icon: 'error',
        confirmButtonText: 'ตกลง'
      });
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันอัปเดต OTP ทีละช่อง (สามารถกรอกตัวอักษร + ตัวเลข)
  const handleOtp = (index, value) => {
    if (!/^[a-zA-Z0-9]*$/.test(value)) return; // ✅ รับเฉพาะ A-Z, a-z, 0-9

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // ✅ เลื่อนไปช่องถัดไปอัตโนมัติเมื่อกรอกเสร็จ
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpSubmit = async () => {
    const otpString = otp.join(""); // ✅ แปลงจากอาร์เรย์เป็นสตริง

    if (!otpString || !userId) {
        Swal.fire({
            title: "กรุณากรอก OTP ของท่าน เพื่อทำการยืนยันตัวตน",
            text: "OTP ไม่สามารถว่างได้",
            icon: "warning",
            confirmButtonText: "ตกลง",
        });
        return;
    }

    try {
        console.log("🔹 ส่งค่าไปยัง API Verify OTP:", { userId, otpString });

        const otpResponse = await verifyOtp(userId, otpString); // ✅ ส่ง OTP ที่แปลงเป็น String

        console.log("📌 OTP API Response:", otpResponse);

        if (otpResponse?.message.toLowerCase().includes("otp verified")) {
            const finalUserId = otpResponse.user_id || userId;
            console.log("✅ บันทึก user_id ลง Cookies:", finalUserId);

            // ✅ ใช้ `js-cookie` เก็บค่าลง Cookies แทน Local Storage
            Cookies.set("user_id", finalUserId, { path: "/" });
            Cookies.set("access_token", otpResponse.access_token, { path: "/", secure: true });
            Cookies.set("refresh_token", otpResponse.refresh_token, { path: "/", secure: true });
            Cookies.set("access_expires_time", otpResponse.access_expires_time, { path: "/" });
            Cookies.set("refresh_expires_time", otpResponse.refresh_expires_time, { path: "/" });
            Cookies.set("roles", JSON.stringify(otpResponse.roles), { path: "/" });

            // ✅ ตรวจสอบว่า company_id มีค่าหรือไม่ก่อนบันทึก
            if (otpResponse.company_exist && otpResponse.company_id) {
                console.log("✅ มี Company ID:", otpResponse.company_id);
                Cookies.set("company_id", otpResponse.company_id, { path: "/" });
            } else {
                console.warn("🚨 ไม่มี Company ID! ลบค่าที่มีอยู่ใน Cookies");
                Cookies.remove("company_id"); // ❌ ลบค่าเก่าถ้ามีปัญหา
            }

            // ✅ ตรวจสอบค่าที่ถูกบันทึกใน Cookies
            console.log("🔍 Cookies company_id:", Cookies.get("company_id"));

            // ✅ ถ้ามี Company ID ให้ไปที่ Dashboard
            if (otpResponse.company_exist) {
                Swal.fire({
                    title: "ยืนยัน OTP สำเร็จ!",
                    text: "กำลังนำคุณไปยังแดชบอร์ด...",
                    icon: "success",
                    confirmButtonText: "ตกลง",
                }).then(() => {
                    router.push("/MainDashboard");
                });

            } else {
                console.warn("❌ ยังไม่มี Company ID, ต้องให้ผู้ใช้เพิ่มก่อน");
                Swal.fire({
                    title: "เพิ่ม Company ID ก่อนเข้าใช้งาน!",
                    text: "คุณต้องเพิ่ม Company ID ก่อนเข้าสู่ระบบ",
                    icon: "warning",
                    confirmButtonText: "ตกลง",
                }).then(() => {
                    router.push("/AddCompanyID"); // ✅ เปลี่ยนเส้นทางให้ตรงกับ Route ของคุณ
                });
            }
        } else {
            console.warn("❌ OTP ไม่ถูกต้อง:", otpResponse?.message);
            Swal.fire({
                title: "OTP ไม่ถูกต้อง",
                text: otpResponse?.message || "กรุณาตรวจสอบ OTP อีกครั้ง",
                icon: "error",
                confirmButtonText: "ตกลง",
            });
        }
    } catch (error) {
        console.error("❌ เกิดข้อผิดพลาดในการยืนยัน OTP:", error);
        Swal.fire({
            title: "เกิดข้อผิดพลาด",
            text: error.message || "ไม่สามารถยืนยัน OTP ได้",
            icon: "error",
            confirmButtonText: "ตกลง",
        });
    }
};

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-6 md:px-20 text-center">
        {/* ✅ เอฟเฟกต์แสงไฟ */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-purple-500/20 blur-[200px] opacity-40"></div>
        <div className="bg-white backdrop-blur-lg rounded-2xl shadow-2xl flex flex-col md:flex-row w-full max-w-4xl overflow-hidden transition-all duration-500">
          {/* LEFT SECTION */}
          <div className='w-full md:w-3/5 p-8 md:p-10'>
            <div className='font-bold text-zinc-800 text-2xl flex justify-center'>
              <span className="text-zinc-800 tracking-wide">DOGNOSE</span>
            </div>
            <div className="border-2 w-12 border-zinc-800 inline-block my-3"></div>
            <h2 className="text-2xl md:text-3xl font-bold text-zinc-800 mb-4 animate-fade-in">
              ลงทะเบียนเข้าสู่ระบบ
            </h2>
            <p className="text-sm text-gray-600 mb-5 text-center">
              เข้าสู่ระบบเพื่อเข้าถึงฟีเจอร์พิเศษของ DOGNOSE
            </p>

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} className="flex flex-col items-center text-left space-y-4">
              <InputField
                type="text"
                name="identifier"
                value={identifier}
                onChange={(e) =>
                  setIdentifier(e.target.value)}
                placeholder="ชื่อผู้ใช้หรืออีเมล"
                icon={FaEnvelope}
                error={errors.identifier}
              />
              <InputField
                type="password"
                name="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)}
                placeholder="รหัสผ่าน"
                icon={MdLockOutline}
                error={errors.password}
              />
              <div className="flex justify-end w-full md:w-64 mt-2 mb-2">
                <Link href="/ForgotPassword" className="text-xs text-zinc-800 hover:underline">
                  ลืมรหัสผ่าน?
                </Link>
              </div>

              {/* Submit Button */}
              <button type="submit" disabled={loading} className="relative border-2 border-zinc-800 text-zinc-800 rounded-full px-8 md:px-12 py-2 font-semibold hover:bg-zinc-800 hover:text-white transition-all duration-300 group overflow-hidden shadow-md">
                {loading ? <Lottie animationData={loadingAnimation} loop={true} className="w-8 h-8" /> : <span className="relative z-10">เข้าสู่ระบบ</span>}
                <div className="absolute inset-0 bg-zinc-800 transform scale-0 group-hover:scale-100 transition-all duration-300 rounded-full"></div>
              </button>

              {/* Register Link */}
              <p className="text-sm text-gray-600 mt-4">
                ยังไม่มีบัญชี? <Link href="/Register" className="text-blue-600 hover:underline">ลงทะเบียนตอนนี้</Link>
              </p>
            </form>
          </div>

          {/* RIGHT SECTION */}
          <div className="w-full md:w-2/5 text-white rounded-tl-lg rounded-b-lg md:rounded-tr-2xl md:rounded-br-2xl py-12 px-6 md:py-36 flex flex-col items-center transition-all duration-500 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/bg-login.png')" }}>
            <h2 className="text-2xl md:text-3xl font-bold mb-2 animate-slide-in">
              ยินดีต้อนรับกลับ!
            </h2>
            <div className="border-2 w-12 border-white inline-block mb-2"></div>
            <p className="mb-6 md:mb-10 text-sm text-center">
              เข้าสู่ระบบเพื่อเข้าถึง **การแจ้งเตือนมลพิษ** และ **ระบบวิเคราะห์กลิ่นอัจฉริยะ**
              ให้ DOGNOSE ดูแลความปลอดภัยของคุณทุกที่ ทุกเวลา
            </p>
          </div>
        </div>
      </main>

      {/* ฟอร์ม OTP */}
      {otpRequired && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-zinc-800 p-6 rounded-lg shadow-lg w-[400px] text-center ">
            {/* ไอคอนด้านบน */}
            <div className='flex flex-col items-center'>
              <img src="/images/OTP.png" alt="OTP Icon" className='w-16 h-16' />
              <h2 className='text-xl font-bold mt-3 text-zinc-100'>ยืนยันที่อยู่อีเมลของคุณ</h2>
              <p className="text-gray-500 text-sm mt-1">
                เราได้ส่งรหัส OTP ไปยังอีเมลของคุณ โปรดกรอกเพื่อดำเนินการต่อ.
              </p>
            </div>
            {/* ช่องกรอก OTP แบบแยก 6 ช่อง */}
            <div className='flex justify-center gap-2 mt-5'>
              {otp.map((num, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={num}
                  onChange={(e) => handleOtp(index, e.target.value)}
                  className="w-12 h-12 border-2 border-gray-300 rounded-md text-center text-lg font-bold focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              ))}
            </div>
            <button onClick={handleOtpSubmit}
              className="mt-5 text-white border-2 border-white rounded-full px-8 md:px-12 py-2 font-semibold hover:bg-white hover:text-zinc-800">
              ยืนยัน OTP
            </button>
          </div>
        </div>
      )}
    </div>
  );
}