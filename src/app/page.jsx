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
      const storedUserId = localStorage.getItem('user_id');
      if (storedUserId) {
        console.log("✅ พบ `user_id` ใน Local Storage:", storedUserId);
        router.push('/MainDashboard');
      } else {
        console.warn("❌ ไม่พบ `user_id` → อาจต้องให้ผู้ใช้ Login ใหม่");
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
          localStorage.setItem('user_id', loginResponse.userId);

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

  // ฟังก์ชันส่ง OTP ไปตรวจสอบ
  const handleOtpSubmit = async () => {
    const otpString = otp.join(""); // ✅ แปลงจากอาร์เรย์เป็นสตริง

    if (!otpString || !userId) {
      Swal.fire({
        title: 'กรุณากรอก OTP ของท่าน เพื่อทำการยืนยันตัวตน',
        text: 'OTP ไม่สามารถว่างได้',
        icon: 'warning',
        confirmButtonText: 'ตกลง'
      });
      return;
    }

    try {
      console.log("🔹 ส่งค่าไปยัง API Verify OTP:", { userId, otpString });

      const otpResponse = await verifyOtp(userId, otpString); // ✅ ส่ง OTP ที่แปลงเป็น String

      console.log("📌 OTP API Response:", otpResponse);

      if (otpResponse?.message.toLowerCase().includes("otp verified")) {
        const finalUserId = otpResponse.user_id || userId;
        console.log("✅ บันทึก user_id ลง Local Storage:", finalUserId);

        // ✅ บันทึกข้อมูลลง Local Storage
        localStorage.setItem('user_id', finalUserId);
        localStorage.setItem('access_token', otpResponse.access_token);
        localStorage.setItem('refresh_token', otpResponse.refresh_token);
        localStorage.setItem('access_expires_time', otpResponse.access_expires_time);
        localStorage.setItem('refresh_expires_time', otpResponse.refresh_expires_time);

        Swal.fire({
          title: 'ยืนยัน OTP สำเร็จ!',
          text: 'กำลังนำคุณไปยังแดชบอร์ด...',
          icon: 'success',
          confirmButtonText: 'ตกลง'
        }).then(() => {
          router.push('/MainDashboard');
        });

      } else {
        console.warn("❌ OTP ไม่ถูกต้อง:", otpResponse?.message);
        Swal.fire({
          title: 'OTP ไม่ถูกต้อง',
          text: otpResponse?.message || 'กรุณาตรวจสอบ OTP อีกครั้ง',
          icon: 'error',
          confirmButtonText: 'ตกลง'
        });
      }

    } catch (error) {
      console.error("❌ เกิดข้อผิดพลาดในการยืนยัน OTP:", error);
      Swal.fire({
        title: 'เกิดข้อผิดพลาด',
        text: error.message || 'ไม่สามารถยืนยัน OTP ได้',
        icon: 'error',
        confirmButtonText: 'ตกลง'
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-6 md:px-20 text-center">
        <div className="bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row w-full max-w-4xl">
          {/* LEFT SECTION */}
          <div className='w-full md:w-3/5 p-5'>
            <div className='font-bold text-zinc-800 justify-center'>
              <span className="text-zinc-800">DOG</span>NOSE
            </div>
            <div className="border-2 w-10 border-zinc-800 inline-block"></div>
            <h2 className="text-2xl md:text-3xl font-bold text-zinc-800 mb-2">
              ลงทะเบียนเข้าสู่ระบบ
            </h2>

            {/* Social Login
            <div className="flex justify-center my-4 space-x-3">
              <button
                onClick={handleGoogleLogin}
                className="border-2 rounded-full p-3 bg-black"                 >
                <FaGoogle className="text-sm text-white" />
              </button>

            </div> */}
            <p className="text-zinc-800 my-3">หรือ</p>
            <form onSubmit={handleLoginSubmit} className='flex flex-col items-center'>

              {/* Username */}
              <div className="w-full max-w-sm md:w-64">
                <div className={`bg-gray-100 p-2 flex items-center rounded-md ${errors.identifier ? 'border-2 border-red-500' : ''}`}>
                  <FaEnvelope className="text-zinc-500 m-2" />
                  <input
                    type="text"
                    placeholder="อีเมลหรือชื่อผู้ใช้"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    onBlur={validateInputs}
                    className="bg-gray-100 outline-none text-sm flex-1 text-black" />
                </div>
                {errors.identifier && <p className="text-red-500 text-xs text-left mt-1">{errors.identifier}</p>}
              </div>

              {/* Password */}
              <div className="w-full max-w-sm mt-2 md:w-64">
                <div className={`bg-gray-100 p-2 flex items-center rounded-md ${errors.password ? 'border-2 border-red-500' : ''}`}>
                  <MdLockOutline className="text-zinc-500 m-2" />
                  <input
                    type="password"
                    placeholder="รหัสผ่าน"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={validateInputs}
                    className="bg-gray-100 outline-none text-sm flex-1 text-black" />
                </div>
                {errors.password && <p className="text-red-500 text-xs text-left mt-1">{errors.password}</p>}
              </div>


              <div className="flex justify-end w-full md:w-64 mb-5">
                <Link
                  href="/ForgotPassword"
                  className="text-xs text-zinc-800"
                >
                  ลืมรหัสผ่าน
                </Link>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="border-2 border-zinc-800 text-zinc-800 rounded-full px-8 md:px-12 py-2 font-semibold hover:bg-zinc-800 hover:text-white">
                {loading ? (
                  <Lottie animationData={loadingAnimation} loop={true} className="w-8 h-8" />
                ) : (
                  "เข้าสู่ระบบ"
                )}
              </button>
            </form>
          </div>

          {/* Right Section */}
          <div className="w-full md:w-2/5 bg-zinc-800 rounded-tl-lg text-white rounded-b-lg md:rounded-tr-2xl md:rounded-br-2xl py-12 px-6 md:py-36">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              ยินดีต้อนรับ
            </h2>
            <div className="border-2 w-10 border-white inline-block mb-2"></div>
            <p className="mb-6 md:mb-10">กรอกข้อมูลส่วนบุคคลและเริ่มการเดินทางไปกับเรา.</p>
            <Link
              href="/Register"
              className="border-2 border-white rounded-full px-8 md:px-12 py-2 font-semibold hover:bg-white hover:text-zinc-800"
            >
              สมัครสมาชิก
            </Link>
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




