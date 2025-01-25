"use client";
import React, { useState } from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import Link from "next/link";
import { FaEnvelope, FaPerson } from "react-icons/fa6";
import { MdLockOutline } from "react-icons/md";
import { IoPhonePortraitOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { db } from "@/app/firebase/config";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { sendEmailVerification } from "firebase/auth";
import Swal from "sweetalert2";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const [createUserWithEmailAndPassword] =
    useCreateUserWithEmailAndPassword(auth);

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleInputChange = (field, value) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: value ? "" : prevErrors[field], // ลบข้อความแจ้งเตือนเมื่อมีค่า
    }));

    if (field === "email") setEmail(value);
    if (field === "password") setPassword(value);
    if (field === "confirmPassword") setConfirmPassword(value);
    if (field === "name") setName(value);
    if (field === "phoneNumber") setPhoneNumber(value);
  };

  const handleSignUP = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!email) newErrors.email = "กรุณากรอกอีเมล";
    if (!password) newErrors.password = "กรุณากรอกรหัสผ่าน";
    if (!confirmPassword) newErrors.confirmPassword = "กรุณายืนยันรหัสผ่าน";
    if (!name) newErrors.name = "กรุณากรอกชื่อ";
    if (!phoneNumber) newErrors.phoneNumber = "กรุณากรอกเบอร์โทรศัพท์";

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน";
    }

    if (!validatePassword(password)) {
      newErrors.password =
        "รหัสผ่านต้องมีตัวอักษรตัวใหญ่, ตัวเล็ก, ตัวเลข และอักขระพิเศษ";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      const res = await createUserWithEmailAndPassword(email, password);
      const user = res.user;

      // Send email verification
      await sendEmailVerification(user);

      // Save user details in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        phoneNumber,
        email,
        createdAt: serverTimestamp(),
      });

      Swal.fire({
        icon: "success",
        title: "Registration Successful",
        text: "กรุณาตรวจสอบอีเมลของคุณเพื่อยืนยันบัญชี",
      });

      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setName("");
      setPhoneNumber("");
      router.push("/");
    } catch (error) {
      console.error("Error during registration:", error);
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error.message,
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-6 bg-gray-100">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-4 md:px-20 text-center">
        <div className="bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row w-full max-w-4xl">
          {/* Form Section */}
          <div className="w-full md:w-3/5 p-5">
            <div className="text-left font-bold">
              <span className="text-zinc-800">Company</span>Name
            </div>
            <div className="py-6 md:py-10">
              <form
                onSubmit={handleSignUP}
                className="flex flex-col items-center space-y-4"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-zinc-800 bg-white">
                  สมัครสมาชิก
                </h2>
                <div className="border-2 w-10 border-zinc-800 inline-block"></div>

                <div className="bg-gray-100 w-full max-w-sm p-2 flex items-center">
                  <FaEnvelope className="text-zinc-800 m-2" />
                  <input
                    type="email"
                    id="email"
                    placeholder="อีเมล"
                    value={email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="bg-gray-100 outline-none text-sm flex-1 text-black"
                  />
                </div>
                {errors.email && (
                  <div className="text-red-500">{errors.email}</div>
                )}
                <div className="bg-gray-100 w-full max-w-sm p-2 flex items-center">
                  <MdLockOutline className="text-zinc-800 m-2" />
                  <input
                    type="password"
                    id="password"
                    placeholder="พาสเวิร์ด"
                    value={password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className="bg-gray-100 outline-none text-sm flex-1 text-black"
                  />
                </div>
                {errors.password && (
                  <div className="text-red-500 w-full max-w-sm p-2 flex items-center">{errors.password}</div>
                )}
                <div className="bg-gray-100 w-full max-w-sm p-2 flex items-center">
                  <MdLockOutline className="text-zinc-800 m-2" />
                  <input
                    type="password"
                    id="confirmPassword"
                    placeholder="ยืนยันรหัสผ่าน"
                    value={confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    className="bg-gray-100 outline-none text-sm flex-1 text-black"
                  />
                </div>
                {errors.confirmPassword && (
                  <div className="text-red-500">
                    {errors.confirmPassword}
                  </div>
                )}

                <div className="bg-gray-100 w-full max-w-sm p-2 flex items-center">
                  <FaPerson className="text-zinc-800 m-2" />
                  <input
                    type="name"
                    id="name"
                    placeholder="ชื่อ"
                    value={name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="bg-gray-100 outline-none text-sm flex-1 text-black"
                  />
                </div>
                {errors.name && (
                  <div className="text-red-500">{errors.name}</div>
                )}
                <div className="bg-gray-100 w-full max-w-sm p-2 flex items-center">
                  <IoPhonePortraitOutline className="text-zinc-800 m-2" />
                  <input
                    type="phoneNumber"
                    id="phoneNumber"
                    placeholder="เบอร์โทรศัพท์"
                    value={phoneNumber}
                    onChange={(e) =>
                      handleInputChange("phoneNumber", e.target.value)
                    }
                    className="bg-gray-100 outline-none text-sm flex-1 text-black"
                  />
                </div>
                {errors.phoneNumber && (
                  <div className="text-red-500">{errors.phoneNumber}</div>
                )}
                <button
                  type="submit"
                  className="border-2 border-zinc-800 text-zinc-800 rounded-full px-8 py-2 font-semibold hover:bg-zinc-800 hover:text-white"
                >
                  ลงทะเบียน
                </button>
              </form>
            </div>
          </div>

          {/* Welcome Section */}
          <div className="w-full md:w-2/5 bg-zinc-800 text-white rounded-b-2xl md:rounded-tr-2xl md:rounded-br-2xl py-12 px-6 md:py-36">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              ยินดีต้อนรับ
            </h2>
            <div className="border-2 w-10 border-white inline-block mb-4"></div>
            <p className="text-sm md:text-base mb-6">หากคุณมีบัญชีอยู่แล้ว.</p>
            <Link
              href="/"
              className="border-2 border-white rounded-full px-6 py-2 font-semibold hover:bg-white hover:text-zinc-800"
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
