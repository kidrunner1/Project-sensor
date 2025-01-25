"use client";
import { useState } from "react";
import {
  getAuth,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";

const LoginSecurity = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const auth = getAuth();
  const user = auth.currentUser;

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
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);

      await updatePassword(user, newPassword);
      setSuccess("เปลี่ยนรหัสผ่านสำเร็จ");
    } catch (err) {
      setError("เกิดข้อผิดพลาด: " + err.message);
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
          <div className="mt-2">
            <label className="block text-sm font-medium">
              รหัสผ่านใหม่
            </label>
          </div>

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
          className="mt-6 w-full border-2  border-zinc-800 text-zinc-800 px-4 py-2 font-semibold rounded hover:bg-zinc-800 hover:text-white"
        >
          เปลี่ยนรหัสผ่าน
        </button>
      </div>
    </div>
  );
};

export default LoginSecurity;
