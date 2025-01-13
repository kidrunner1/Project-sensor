"use client";
import React, { useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation"; // Correct import for app router
import Link from "next/link";
import {
  FaEnvelope,
  FaFacebook,
  FaGoogle,
  FaRegEnvelope,
} from "react-icons/fa";
import { MdLockOutline } from "react-icons/md";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form submission from refreshing the page
    try {
      const res = await signInWithEmailAndPassword(email, password);
      console.log("User:", res.user);
      setEmail("");
      setPassword("");
      router.push("/Login"); // Navigate to the home page
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <div className="bg-white rounded-2xl shadow-2xl flex w-2/3 max-w-4xl">
          <div className="w-3/5 p-5">
            <div className="tet-left font-bold">
              <span className="text-zinc-800">Company</span>Name
            </div>
            <div className="py-10">
              <h2 className="text-3xl font-bold text-zinc-800 mb-2 bg-white">
                ลงทะเบียนเข้าสู่ระบบ
              </h2>
              <div className="border-2 w-10 border-zinc-800 inline-block mb-2"></div>
              {/* Section Another Login */}
              <div className="flex justify-center my-2 space-x-3">
                <Link
                  href=""
                  className="border-2 border-grey-200 rounded-full p-3 max-1 bg-black"
                >
                  <FaFacebook className="text-sm" />
                </Link>
                <Link
                  href=""
                  className="border-2 border-grey-200 rounded-full p-3 max-1 bg-black"
                >
                  <FaGoogle className="text-sm" />
                </Link>
              </div>
              <p className="text-zinc-800 my-3">หรือ</p>
              <div className="flex flex-col item-center">
                <form
                  onSubmit={handleLogin}
                  className="flex flex-col items-center"
                >
                  <div className="bg-gray-100 w-64 p-2 flex items-center mb-3">
                    <FaEnvelope className="text-zinc-800 m-2 " />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="อีเมล"
                      required
                      className="bg-gray-100 outline-none text-sm flex-1 text-black"
                    />
                  </div>
                  <div className="bg-gray-100 w-64 p-2 flex items-center mb-3">
                    <MdLockOutline className="text-zinc-800 m-2 " />
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={handlePasswordChange}
                      required
                      placeholder="พาสเวิร์ด"
                      className="bg-gray-100 outline-none text-sm flex-1 text-black"
                    />
                  </div>
                  <div className="flex justify-between w-64 mb-5">
                    <label className="flex items-center text-xs text-zinc-800">
                      <input type="checkbox" name="remember" className="mr-1" />
                      จดจำฉันไว้
                    </label>
                    <Link href="/ForgotPassword" className="text-xs text-zinc-800">
                      ลืมรหัสผ่าน
                    </Link>
                  </div>
                  <button className="border-2 border-zinc-800 text-zinc-800 rounded-full px-12 py-2 inline-block font-semibold hover:bg-zinc-800 hover:text-white">
                    เข้าสู่ระบบ
                  </button>
                </form>
              </div>
            </div>
          </div>
          {/* Sing in Section */}
          <div className="w.2/5 bg-zinc-800	 text-white rounded-tr-2xl rouneded-br-2xl py-36 px-12">
            <h2 className="text-3xl font-bold mb-2">ยินดีต้อนรับ</h2>
            <div className="border-2 w-10 border-white inline-block mb-2"></div>
            <p className="mb-10">
              กรอกข้อมูลส่วนบุคคลและเริ่มการเดินทางไปกับเรา.
            </p>
            <Link
              href="/Register"
              className="border-2 border-white rounded-full px-12 py-2 inline-block font-semibold hover:bg-white hover:text-zinc-800"
            >
              สมัครสมาชิก
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
