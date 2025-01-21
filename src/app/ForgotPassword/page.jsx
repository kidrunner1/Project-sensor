"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/app/firebase/config";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage(
        "หากอีเมลนี้ได้รับการลงทะเบียนแล้ว คุณจะได้รับลิงก์รีเซ็ตรหัสผ่าน."
      );
    } catch (err) {
      setError("ไม่สามารถส่งลิงก์รีเซ็ตรหัสผ่านได้. กรุณาตรวจสอบอีเมล.");
      console.error(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-6 bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-zinc-800 text-center mb-4">
          ลืมรหัสผ่าน
        </h2>
        <div className="border-2 w-10 border-zinc-800 mx-auto mb-6"></div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-zinc-800 font-semibold mb-2"
            >
              กรุกรอกอีเมลของคุณ
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-800"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-zinc-800 text-white py-2 rounded-full font-semibold hover:bg-zinc-700 transition duration-300"
          >
            ส่งลิงก์รีเซ็ตรหัสผ่าน
          </button>
        </form>
        {message && (
          <p className="mt-4 text-green-500 text-center font-semibold">
            {message}
          </p>
        )}
        {error && (
          <p className="mt-4 text-red-500 text-center font-semibold">{error}</p>
        )}
        <button
          onClick={() => router.back()}
          className="mt-6 w-full bg-gray-200 text-zinc-800 py-2 rounded-full font-semibold hover:bg-gray-300 transition duration-300"
        >
          กลับ
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
