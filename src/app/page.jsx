"use client";
import React, { useState, useEffect } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, googleProvider, facebookProvider } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import { signInWithPopup, FacebookAuthProvider } from "firebase/auth";
import { FaEnvelope, FaFacebook, FaGoogle } from "react-icons/fa";
import { MdLockOutline } from "react-icons/md";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore";
import {
  fetchSignInMethodsForEmail,
  EmailAuthProvider,
  linkWithCredential,
} from "firebase/auth";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await signInWithEmailAndPassword(email, password);
      const user = res.user;

      if (!user.emailVerified) {
        await Swal.fire({
          icon: "warning",
          title: "กรุณายืนยันอีเมลของคุณก่อนเข้าสู่ระบบ",
          text: "กรุณาตรวจสอบอีเมลของคุณและทำการยืนยันอีเมล",
          confirmButtonText: "ตกลง",
        });
        await user.sendEmailVerification();
        return;
      }

      console.log("User:", user);
      setEmail("");
      setPassword("");
      router.push("/MainDashboard");
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
        confirmButtonText: "ลองใหม่",
      });
    }
  };

  const db = getFirestore();

  const handleSocialLogin = async (provider) => {
    try {
      const res = await signInWithPopup(auth, provider);
      const user = res.user;

      // ตรวจสอบ providerId
      const providerId = user.providerData[0]?.providerId;

      if (providerId === "google.com" || providerId === "facebook.com") {
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          displayName: user.displayName,
          providerId: providerId,
          createdAt: serverTimestamp(),
        });
        console.log("Social login successful:", user);
        router.push("/MainDashboard");
        return; // ข้ามการตรวจสอบอีเมล
      }
    } catch (error) {
      if (error.code === "auth/account-exists-with-different-credential") {
        const email = error.customData.email;
        const pendingCredential =
          FacebookAuthProvider.credentialFromError(error);

        // ดึงรายการ provider ของอีเมลที่มีอยู่
        const signInMethods = await fetchSignInMethodsForEmail(auth, email);

        if (
          signInMethods.includes(
            EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD
          )
        ) {
          Swal.fire({
            icon: "info",
            title: "บัญชีนี้ใช้ Email/Password",
            text: "โปรดเข้าสู่ระบบด้วยอีเมลและรหัสผ่านแทน",
            confirmButtonText: "ตกลง",
          });
        } else if (signInMethods.includes("google.com")) {
          Swal.fire({
            icon: "info",
            title: "บัญชีนี้ใช้ Google",
            text: "โปรดเข้าสู่ระบบด้วย Google แทน",
            confirmButtonText: "ตกลง",
          });
        }
        console.log("Starting social login...");
        try {
          const res = await signInWithPopup(auth, provider);
          console.log("Social login success:", res.user);
        } catch (error) {
          console.error("Social login error:", error);
        }

        // หากผู้ใช้ต้องการเชื่อมบัญชี
        const existingUser = auth.currentUser;
        if (existingUser) {
          try {
            await linkWithCredential(existingUser, pendingCredential);
            Swal.fire({
              icon: "success",
              title: "เชื่อมบัญชีสำเร็จ",
              text: "บัญชีของคุณเชื่อมต่อเรียบร้อยแล้ว",
              confirmButtonText: "ตกลง",
            });
            router.push("/MainDashboard");
          } catch (linkError) {
            console.error("Error linking accounts:", linkError);
          }
        }
      } else {
        console.error("Error:", error);
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "การเข้าสู่ระบบผ่านโซเชียลมีเดียล้มเหลว",
          confirmButtonText: "ลองใหม่",
        });
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-6 md:px-20 text-center">
        <div className="bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row w-full max-w-4xl">
          {/* Left Section */}
          <div className="w-full md:w-3/5 p-5 ">
            <div className="font-bold text-zinc-800 justify-center">
              <span className="text-zinc-800">DOG</span>NOSE
            </div>
            <div className="py-10">
              <h2 className="text-2xl md:text-3xl font-bold text-zinc-800 mb-2">
                ลงทะเบียนเข้าสู่ระบบ
              </h2>
              <div className="border-2 w-10 border-zinc-800 inline-block mb-2"></div>

              {/* Social Login */}
              <div className="flex justify-center my-4 space-x-3">
                <button
                  onClick={() => handleSocialLogin(googleProvider)}
                  className="border-2 rounded-full p-3 bg-black"
                >
                  <FaGoogle className="text-sm text-white" />
                </button>
              </div>
              <p className="text-zinc-800 my-3">หรือ</p>
              {/* Login Form */}
              <form
                onSubmit={handleLogin}
                className="flex flex-col items-center"
              >
                <div className="bg-gray-100 w-full md:w-64 p-2 flex items-center mb-3">
                  <FaEnvelope className="text-zinc-800 m-2 " />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="อีเมล"
                    required
                    className="bg-gray-100 outline-none text-sm flex-1 text-black"
                  />
                </div>
                <div className="bg-gray-100 w-full md:w-64 p-2 flex items-center mb-3">
                  <MdLockOutline className="text-zinc-800 m-2 " />
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="พาสเวิร์ด"
                    className="bg-gray-100 outline-none text-sm flex-1 text-black"
                  />
                </div>
                <div className="flex justify-between w-full md:w-64 mb-5">
                  <label className="flex items-center text-xs text-zinc-800">
                    <input type="checkbox" className="mr-1" />
                    จดจำฉันไว้
                  </label>
                  <Link
                    href="/ForgotPassword"
                    className="text-xs text-zinc-800"
                  >
                    ลืมรหัสผ่าน
                  </Link>
                </div>
                <button className="border-2 border-zinc-800 text-zinc-800 rounded-full px-8 md:px-12 py-2 font-semibold hover:bg-zinc-800 hover:text-white">
                  เข้าสู่ระบบ
                </button>
              </form>
            </div>
          </div>

          {/* Right Section */}
          <div className="w-full md:w-2/5 bg-zinc-800 text-white rounded-b-2xl md:rounded-tr-2xl md:rounded-br-2xl py-12 px-6 md:py-36">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              ยินดีต้อนรับ
            </h2>
            <div className="border-2 w-10 border-white inline-block mb-2"></div>
            <p className="mb-6 md:mb-10">
              กรอกข้อมูลส่วนบุคคลและเริ่มการเดินทางไปกับเรา.
            </p>
            <Link
              href="/Register"
              className="border-2 border-white rounded-full px-8 md:px-12 py-2 font-semibold hover:bg-white hover:text-zinc-800"
            >
              สมัครสมาชิก
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
