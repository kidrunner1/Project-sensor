"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaBuilding } from "react-icons/fa";
import { addCompanyId } from "@/app/serviveAPI/AddCompanyID/serviceAddcompanyId";
import Swal from "sweetalert2";

const AddCompanyID = () => {
  const [companyID, setCompanyID] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedCompanyId = localStorage.getItem("company_id");
    if (storedCompanyId) {
      router.push("/MainDashboard"); // ถ้ามี Company ID แล้ว ส่งไปที่ Dashboard ทันที
    }
  }, []);

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const userId = localStorage.getItem("user_id");
      const accessToken = localStorage.getItem("access_token");
      const refreshToken = localStorage.getItem("refresh_token");

      if (!userId || !accessToken || !refreshToken) {
        throw new Error("⚠️ ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่");
      }

      // ✅ เรียก API เพื่อ Add Company ID
      await addCompanyId(userId, companyID, accessToken, refreshToken);

      // ✅ บันทึก Company ID ลง LocalStorage
      localStorage.setItem("company_id", companyID);

      // ✅ แจ้งเตือนสำเร็จ
      Swal.fire({
        title: "✅ เพิ่ม Company ID สำเร็จ!",
        text: "กำลังนำคุณไปยังแดชบอร์ด...",
        icon: "success",
        confirmButtonText: "ตกลง",
      }).then(() => {
        router.push("/MainDashboard"); // ✅ ไปที่ Dashboard
      });
    } catch (error) {
      Swal.fire({
        title: "❌ เพิ่ม Company ID ไม่สำเร็จ",
        text: error.message || "กรุณาลองอีกครั้ง",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-900 text-white p-4">
      <div className="w-full max-w-md bg-zinc-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">กรอกหมายเลขไอดีบริษัทของคุณ</h2>

        {/* Floating Input Field พร้อมไอคอน */}
        <div className="relative">
          <FaBuilding className="absolute left-3 top-4 text-zinc-400 transition-all" size={20} />
          <input
            type="text"
            id="companyID"
            value={companyID}
            onChange={(e) => setCompanyID(e.target.value)}
            className="block w-full px-10 pb-2.5 pt-4 text-sm bg-transparent rounded-lg border border-zinc-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600 peer transition-all"
            placeholder=" "
          />
          <label
            htmlFor="companyID"
            className="absolute text-sm text-zinc-400 duration-300 transform left-10 -translate-y-4 scale-75 top-2 z-10 bg-zinc-800 px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-blue-500 transition-all"
          >
            Company ID
          </label>
        </div>

        {/* Submit Button พร้อมเอฟเฟกต์ */}
        <button
          onClick={handleSubmit}
          className={`w-full mt-6 p-3 font-semibold transition rounded-lg ${
            companyID && !loading ? "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg" : "bg-zinc-600 cursor-not-allowed"
          }`}
          disabled={!companyID || loading}
        >
          {loading ? "⏳ กำลังดำเนินการ..." : "✅ ยืนยัน"}
        </button>
      </div>
    </div>
  );
};

export default AddCompanyID;
