"use client";
import { useState } from "react";
import axios from "axios";
import ipconfig from "@/app/ipconfig";

const LoginSecurity = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChangePassword = async () => {
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("รหัสผ่านใหม่และการยืนยันไม่ตรงกัน");
      return;
    }

    if (newPassword.length < 8) {
      setError("รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร");
      return;
    }

    try {
      const accessToken = sessionStorage.getItem("access_token");
      if (!accessToken) {
        setError("คุณยังไม่ได้เข้าสู่ระบบ");
        return;
      }

      const response = await axios.put(
        `https://${ipconfig.API_HOST}/api/user/change-password`,
        {
          currentPassword,
          newPassword,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      setSuccess("เปลี่ยนรหัสผ่านสำเร็จ");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "เกิดข้อผิดพลาด ไม่สามารถเปลี่ยนรหัสผ่านได้");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">เปลี่ยนรหัสผ่าน</h1>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">รหัสผ่านปัจจุบัน</label>
          <div className="relative mt-2">
            <input
              type={showCurrentPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1 w-full border rounded p-2"
              placeholder="กรอกรหัสผ่านปัจจุบัน"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute top-2 right-3 text-gray-600 hover:text-gray-800"
            >
              {showCurrentPassword ? "ซ่อน" : "แสดง"}
            </button>
          </div>

          <label className="block text-sm font-medium mt-4">รหัสผ่านใหม่</label>
          <div className="relative mt-2">
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 w-full border rounded p-2"
              placeholder="กรอกรหัสผ่านใหม่"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute top-2 right-3 text-gray-600 hover:text-gray-800"
            >
              {showNewPassword ? "ซ่อน" : "แสดง"}
            </button>
          </div>

          <label className="block text-sm font-medium mt-4">ยืนยันรหัสผ่านใหม่</label>
          <div className="relative mt-2">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 w-full border rounded p-2"
              placeholder="ยืนยันรหัสผ่านใหม่"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute top-2 right-3 text-gray-600 hover:text-gray-800"
            >
              {showConfirmPassword ? "ซ่อน" : "แสดง"}
            </button>
          </div>
        </div>

        {error && <p className="text-red-500 mt-4">{error}</p>}
        {success && <p className="text-green-500 mt-4">{success}</p>}

        <button
          onClick={handleChangePassword}
          className="mt-6 w-full border-2 border-zinc-800 text-zinc-800 px-4 py-2 font-semibold rounded hover:bg-zinc-800 hover:text-white"
        >
          เปลี่ยนรหัสผ่าน
        </button>
      </div>
    </div>
  );
};

export default LoginSecurity;
