"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FaEnvelope, FaUser } from "react-icons/fa";
import { MdLockOutline } from "react-icons/md";
import { IoPhonePortraitOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { registerUser } from "@/app/serviveAPI/Register/serviceRegister";
import Swal from "sweetalert2";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ✅ ฟังก์ชันตรวจสอบข้อมูล
  const validateForm = () => {
    const newErrors = {};

    if (!username.trim()) newErrors.username = "กรุณากรอกชื่อผู้ใช้";
    if (!email.trim()) {
      newErrors.email = "กรุณากรอกอีเมล";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "รูปแบบอีเมลไม่ถูกต้อง";
    }
    if (!password.trim()) {
      newErrors.password = "กรุณากรอกรหัสผ่าน";
    } else if (password.length < 6) {
      newErrors.password = "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร";
    }
    if (password !== confirmPassword) newErrors.confirmPassword = "รหัสผ่านไม่ตรงกัน";
    if (!name.trim()) newErrors.name = "กรุณากรอกชื่อ";
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = "กรุณากรอกเบอร์โทรศัพท์";
    } else if (!/^\d{10}$/.test(phoneNumber)) {
      newErrors.phoneNumber = "เบอร์โทรศัพท์ต้องมี 10 หลัก";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // ตรวจสอบความถูกต้องของฟอร์ม

    setLoading(true);

    try {
      // ✅ เรียก API ลงทะเบียน
      const user = await registerUser(name, email, phoneNumber, password, username);

      console.log("📌 Registration success:", user);

      Swal.fire({
        icon: "success",
        title: "สมัครสมาชิกสำเร็จ",
        text: `คุณได้สมัครสมาชิกในชื่อ ${user.username}`,
        confirmButtonText: "ตกลง",
      }).then(() => {
        router.push("/"); // ✅ เปลี่ยนเส้นทางไปหน้า login
      });
    } catch (error) {
      console.error("❌ Registration failed", error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: error.message || "ไม่สามารถสมัครสมาชิกได้",
        confirmButtonText: "ตกลง",
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-6 bg-gray-100">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-4 md:px-20 text-center bg-gradient-to-br from-gray-100 to-gray-300 min-h-screen">
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl flex flex-col md:flex-row w-full max-w-4xl overflow-hidden transition-all duration-500">

          {/* LEFT SECTION */}
          <div className="w-full md:w-3/5 p-8 md:p-10">
            <div className="font-bold text-zinc-800 text-2xl flex justify-center">
              <span className="text-zinc-800 tracking-wide">DOG</span>NOSE
            </div>
            <div className="py-6 md:py-10">
              <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-zinc-800 bg-white animate-fade-in">
                  สมัครสมาชิก
                </h2>
                <div className="border-2 w-10 border-zinc-800 inline-block"></div>

                {/* Username */}
                <div className="w-full max-w-sm relative">
                  <div className={`bg-gray-100 p-2 flex items-center rounded-md transition-all duration-300 ${errors.username ? 'border-2 border-red-500' : 'focus-within:ring-2 focus-within:ring-zinc-800'}`}>
                    <FaUser className="text-zinc-800 m-2" />
                    <input
                      type="text"
                      placeholder="ชื่อผู้ใช้"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onBlur={validateForm}
                      className="bg-gray-100 outline-none text-sm flex-1 text-black  transition-all duration-300 " />
                  </div>
                  {errors.username && <p className="text-red-500 text-xs text-left">{errors.username}</p>}
                </div>

                {/* Email */}
                <div className="w-full max-w-sm relative">
                  <div className={`bg-gray-100 p-2 flex items-center rounded-md transition-all duration-300 ${errors.email ? 'border-2 border-red-500' : 'focus-within:ring-2 focus-within:ring-zinc-800'}`}>
                    <FaEnvelope className="text-zinc-800 m-2" />
                    <input type="email" placeholder="อีเมล" value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={validateForm}
                      className="bg-gray-100 outline-none text-sm flex-1 text-black  transition-all duration-300 " />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs text-left">{errors.email}</p>}
                </div>

                {/* Password */}
                <div className="w-full max-w-sm relative">
                  <div className={`bg-gray-100 p-2 flex items-center rounded-md transition-all duration-300 ${errors.password ? 'border-2 border-red-500' : 'focus-within:ring-2 focus-within:ring-zinc-800'}`}>
                    <MdLockOutline className="text-zinc-800 m-2" />
                    <input type="password" placeholder="รหัสผ่าน" value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onBlur={validateForm}
                      className="bg-gray-100 outline-none text-sm flex-1 text-black  transition-all duration-300 " />
                  </div>
                  {errors.password && <p className="text-red-500 text-xs text-left">{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div className="w-full max-w-sm relative">
                  <div className={`bg-gray-100 p-2 flex items-center rounded-md transition-all duration-300 ${errors.confirmPassword ? 'border-2 border-red-500' : 'focus-within:ring-2 focus-within:ring-zinc-800'}`}>
                    <MdLockOutline className="text-zinc-800 m-2" />
                    <input type="password" placeholder="ยืนยันรหัสผ่าน" value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onBlur={validateForm}
                      className="bg-gray-100 outline-none text-sm flex-1 text-black  transition-all duration-300 " />
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-xs text-left">{errors.confirmPassword}</p>}
                </div>

                {/* Name */}
                <div className="w-full max-w-sm relative">
                  <div className={`bg-gray-100 p-2 flex items-center rounded-md transition-all duration-300 ${errors.name ? 'border-2 border-red-500' : 'focus-within:ring-2 focus-within:ring-zinc-800'}`}>
                    <MdLockOutline className="text-zinc-800 m-2" />
                    <input type="password" placeholder="ชื่อ" value={name}
                      onChange={(e) => setName(e.target.value)}
                      onBlur={validateForm}
                      className="bg-gray-100 outline-none text-sm flex-1 text-black  transition-all duration-300 " />
                  </div>
                  {errors.name && <p className="text-red-500 text-xs text-left">{errors.name}</p>}
                </div>

                {/* Phone Number */}
                <div className="w-full max-w-sm relative">
                  <div className={`bg-gray-100 p-2 flex items-center rounded-md transition-all duration-300 ${errors.phoneNumber ? 'border-2 border-red-500' : 'focus-within:ring-2 focus-within:ring-zinc-800'}`}>
                    <IoPhonePortraitOutline className="text-zinc-800 m-2" />
                    <input
                      type="text"
                      placeholder="เบอร์โทรศัพท์"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      onBlur={validateForm}
                      className="bg-gray-100 outline-none text-sm flex-1 text-black  transition-all duration-300 " />
                  </div>
                  {errors.phoneNumber && <p className="text-red-500 text-xs text-left">{errors.phoneNumber}</p>}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="relative border-2 border-zinc-800 text-zinc-800 rounded-full px-8 py-2 font-semibold hover:bg-zinc-800 hover:text-white transition-all duration-300 group overflow-hidden shadow-md"
                  disabled={loading}
                >
                  {loading ? "กำลังสมัครสมาชิก..." : "ลงทะเบียน"}
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="w-full md:w-2/5 bg-zinc-800 rounded-tl-lg text-white rounded-b-lg md:rounded-tr-2xl md:rounded-br-2xl py-12 px-6 md:py-36 flex flex-col items-center transition-all duration-500">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 animate-slide-in">
              ยินดีต้อนรับ
            </h2>
            <div className="border-2 w-12 border-white inline-block mb-2"></div>
            <p className="mb-6 md:mb-10 text-sm text-center">
              หากคุณมีบัญชีอยู่แล้ว กรุณาเข้าสู่ระบบ
            </p>
            <Link
              href="/"
              className="border-2 border-white rounded-full px-8 py-2 font-semibold hover:bg-white hover:text-zinc-800 transition-all duration-300"
            >
              เข้าสู่ระบบ
            </Link>
          </div>
        </div>
      </main>

    </div>
  );
};

export default Register;





