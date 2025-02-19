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
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phoneNumber: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const router = useRouter();

  const icons = {
    username: <FaUser className="text-zinc-800 m-2" />,
    email: <FaEnvelope className="text-zinc-800 m-2" />,
    password: <MdLockOutline className="text-zinc-800 m-2" />,
    confirmPassword: <MdLockOutline className="text-zinc-800 m-2" />,
    name: <FaUser className="text-zinc-800 m-2" />,
    phoneNumber: <IoPhonePortraitOutline className="text-zinc-800 m-2" />,
  };

  const placeholders = {
    username: "ชื่อผู้ใช้",
    email: "อีเมล",
    password: "รหัสผ่าน",
    confirmPassword: "ยืนยันรหัสผ่าน",
    name: "ชื่อจริง",
    phoneNumber: "เบอร์โทรศัพท์",
  };

  const fieldNames = {
    username: "ชื่อผู้ใช้",
    email: "อีเมล",
    password: "รหัสผ่าน",
    confirmPassword: "ยืนยันรหัสผ่าน",
    phoneNumber: "เบอร์โทรศัพท์",
    firstName: "ชื่อจริง",
    lastName: "นามสกุล",
  };

  const validateField = (name, value) => {
    let error = "";
    const fieldName = fieldNames[name] || name; // ถ้าไม่มีใน fieldNames ใช้ name เดิม

    if (!value.trim()) {
      error = `กรุณากรอก${fieldName}`;
    } else {
      switch (name) {
        case "email":
          if (!/^\S+@\S+\.\S+$/.test(value)) {
            error = "รูปแบบอีเมลไม่ถูกต้อง";
          }
          break;
        case "password":
          if (value.length < 6) {
            error = "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร";
          }
          break;
        case "confirmPassword":
          if (value !== formData.password) {
            error = "รหัสผ่านไม่ตรงกัน";
          }
          break;
        case "phoneNumber":
          if (!/^\d{10}$/.test(value)) {
            error = "เบอร์โทรศัพท์ต้องมี 10 หลัก";
          }
          break;
      }
    }
    return error;
  };

  // ✅ อัปเดตค่าและตรวจสอบเฉพาะช่องที่ถูกแตะ
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (touched[name]) {
      setErrors({ ...errors, [name]: validateField(name, value) });
    }
  };

  // ✅ ตรวจสอบเมื่อผู้ใช้ออกจากช่อง
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    setErrors({ ...errors, [name]: validateField(name, value) });
  };

  // ✅ ตรวจสอบข้อมูลทั้งหมดเมื่อกดปุ่มสมัคร
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    Object.keys(formData).forEach((field) => {
      newErrors[field] = validateField(field, formData[field]);
    });

    if (!acceptedTerms) {
      newErrors.terms = "กรุณายอมรับข้อกำหนดและเงื่อนไข";
    }

    setErrors(newErrors);
    setTouched({
      username: true,
      email: true,
      password: true,
      confirmPassword: true,
      name: true,
      phoneNumber: true,
    });

    if (Object.values(newErrors).some((error) => error)) return;

    setLoading(true);

    try {
      const user = await registerUser(
        formData.name,
        formData.email,
        formData.phoneNumber,
        formData.password,
        formData.username
      );

      Swal.fire({
        icon: "success",
        title: "สมัครสมาชิกสำเร็จ",
        text: `คุณได้สมัครสมาชิกในชื่อ ${user.username}`,
        confirmButtonText: "ตกลง",
      }).then(() => {
        router.push("/");
      });
    } catch (error) {
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
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-6 md:px-20 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-purple-500/20 blur-[200px] opacity-40"></div>
        <div className="bg-white backdrop-blur-lg rounded-2xl shadow-2xl flex flex-col md:flex-row w-full max-w-4xl overflow-hidden transition-all duration-500">
          {/* LEFT SECTION */}
          <div className="w-full md:w-3/5 p-8 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold text-zinc-800 mb-2">
              สมัครสมาชิก
            </h2>
            <p className="text-sm text-gray-600 mb-4 text-center">
              เข้าร่วมชุมชน DOGNOSE เพื่อรับข่าวสารล่าสุด
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
              {Object.keys(formData).map((field) => (
                <div key={field} className="w-full max-w-sm relative">
                  <div
                    className={`relative bg-gray-100 p-2 flex items-center rounded-md transition-all duration-300 ${errors[field] && touched[field] ? "border-2 border-red-500" : "focus-within:ring-2 focus-within:ring-zinc-800"
                      }`}
                  >
                    {icons[field]}

                    <input
                      type={field === "confirmPassword" ? "password" : field.includes("password") ? "password" : "text"}
                      name={field}
                      id={`floating_${field}`}
                      placeholder=" "
                      value={formData[field]}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="bg-gray-100 outline-none text-sm flex-1 text-black placeholder-transparent peer"
                    />

                    <label
                      htmlFor={`floating_${field}`}
                      className="absolute left-10 text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-gray-100 px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-gray-500"
                    >
                      {placeholders[field]}
                    </label>
                  </div>
                  {errors[field] && touched[field] && <p className="text-red-500 text-xs text-left">{errors[field]}</p>}

                  {/* คำอธิบายเพิ่มเติมใต้ช่องกรอก */}
                  {field === "email" && <p className="text-xs text-gray-500 mt-1 text-left">กรุณากรอกอีเมลที่ใช้งานได้จริง</p>}
                  {field === "password" && <p className="text-xs text-gray-500 mt-1 text-left">รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร</p>}
                </div>
              ))}

              {/* Terms & Conditions */}
              <div className="flex items-center space-x-2 text-sm text-zinc-800">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptedTerms}
                  onChange={() => setAcceptedTerms(!acceptedTerms)}
                  className="w-4 h-4 accent-zinc-800 cursor-pointer"
                />
                <label htmlFor="terms" className="cursor-pointer">
                  ฉันยอมรับ{" "}
                  <Link href="/terms" className="text-blue-600 hover:underline">
                    ข้อกำหนดและเงื่อนไข
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`relative border-2 border-zinc-800 text-zinc-800 rounded-full px-8 py-2 font-semibold transition-all duration-300 ${acceptedTerms ? "hover:bg-zinc-800 hover:text-white" : "opacity-50 cursor-not-allowed"
                  }`}
                disabled={!acceptedTerms || loading}
              >
                {loading ? "กำลังสมัครสมาชิก..." : "ลงทะเบียน"}
              </button>

              {/* Already have an account? */}
              <p className="text-sm text-gray-600 mt-4">
                มีบัญชีอยู่แล้ว?{" "}
                <Link href="/" className="text-blue-600 hover:underline">
                  เข้าสู่ระบบที่นี่
                </Link>
              </p>
            </form>
          </div>


          {/* RIGHT SECTION */}
          <div
            className="w-full md:w-2/5 text-white rounded-tl-lg rounded-b-lg md:rounded-tr-2xl md:rounded-br-2xl py-12 px-6 md:py-36 flex flex-col items-center transition-all duration-500 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/bg-login.png')" }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-2 animate-slide-in">
              ยินดีต้อนรับ
            </h2>
            <p className="text-sm md:text-base text-center text-white max-w-xs leading-relaxed">
              เข้าร่วมกับเราวันนี้เพื่อใช้งานระบบ <span className="font-semibold">DOGNOSE</span>
              เทคโนโลยีสุดล้ำที่ช่วยตรวจจับ <span className="font-semibold">กลิ่นสารเคมี</span>
              และ <span className="font-semibold">สิ่งแวดล้อมที่เป็นอันตราย</span> รอบตัวคุณ
              เพื่อความปลอดภัยที่ดียิ่งขึ้น 
            </p>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Register;
