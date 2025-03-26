// "use client";
// import { useState, useEffect } from "react";
// import { getUserData } from "@/app/serviveAPI/GetUser/serviceUser";
// import { FiUser, FiMail, FiPhone, FiUploadCloud, FiTrash2, FiEdit2, FiSave } from "react-icons/fi";
// import Image from "next/image";

// export default function PersonalProfile() {
//   const [userData, setUserData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//   });
//   const [imageURL, setImageURL] = useState("/images/profile.png");
//   const [isLoading, setIsLoading] = useState(true);
//   const [isEditing, setIsEditing] = useState({
//     name: false,
//     phone: false,
//   });

//   useEffect(() => {
//     const fetchUserData = async () => {
//       const accessToken = sessionStorage.getItem("access_token");
//       const userId = sessionStorage.getItem("user_id");

//       if (!accessToken || !userId) {
//         console.warn("ไม่มี access_token หรือ user_id ใน sessionStorage");
//         return;
//       }

//       try {
//         const userData = await getUserData(userId);
//         if (userData) {
//           setUserData({
//             name: userData.name || "",
//             email: userData.email || "",
//             phone: userData.phone || "",
//           });
//           setImageURL(userData.avatar || "/images/profile.png");
//         }
//       } catch (error) {
//         console.error("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchUserData();
//   }, []);

//   const handleInputChange = (e) => {
//     setUserData({ ...userData, [e.target.name]: e.target.value });
//   };

//   const toggleEdit = (field) => {
//     setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
//   };

//   if (isLoading) {
//     return <div className="flex justify-center items-center h-screen text-gray-700">🔄 กำลังโหลดข้อมูล...</div>;
//   }

//   return (
//     <div className="p-6 bg-gray-100 dark:bg-gray-900 flex justify-center">
//       <div className="w-full max-w-5xl grid grid-cols-3 gap-6">
//         {/* ส่วนรูปโปรไฟล์ */}
//         <div className="col-span-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center">
//           <Image src={imageURL} alt="Profile" width={120} height={120} className="rounded-full border-4 border-gray-300 dark:border-gray-600" />
//           <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">อัปโหลดรูปได้สูงสุด 2MB</p>
//           <div className="mt-3 flex flex-col gap-2 w-full">
//             <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 w-full">
//               <FiUploadCloud /> อัปโหลดรูป
//             </button>
//             <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg shadow hover:bg-gray-400 w-full">
//               <FiTrash2 /> ลบรูป
//             </button>
//           </div>
//         </div>

//         {/* ส่วนข้อมูลส่วนตัว */}
//         <div className="col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
//           <h2 className="text-lg font-semibold text-gray-900 dark:text-white">ข้อมูลส่วนตัว</h2>
//           <div className="mt-4 space-y-4">
//             {/* ชื่อ */}
//             <div className="border p-4 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 flex items-center justify-between">
//               <div className="w-full">
//                 <label className="text-sm text-gray-500 dark:text-gray-400">ชื่อ - นามสกุล</label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={userData.name}
//                   onChange={handleInputChange}
//                   readOnly={!isEditing.name}
//                   className={`w-full mt-1 p-2 border rounded-lg dark:bg-gray-800 dark:text-white ${isEditing.name ? "" : "bg-gray-200 cursor-not-allowed"}`}
//                 />
//               </div>
//               <FiEdit2 className="text-gray-500 cursor-pointer ml-3" onClick={() => toggleEdit("name")} />
//             </div>

//             {/* อีเมล (อ่านอย่างเดียว) */}
//             <div className="border p-4 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
//               <label className="text-sm text-gray-500 dark:text-gray-400">อีเมล</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={userData.email}
//                 readOnly
//                 className="w-full mt-1 p-2 border rounded-lg bg-gray-200 dark:bg-gray-800 dark:text-gray-400 cursor-not-allowed"
//               />
//             </div>

//             {/* เบอร์โทรศัพท์ */}
//             <div className="border p-4 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 flex items-center justify-between">
//               <div className="w-full">
//                 <label className="text-sm text-gray-500 dark:text-gray-400">เบอร์โทรศัพท์</label>
//                 <input
//                   type="text"
//                   name="phone"
//                   value={userData.phone}
//                   onChange={handleInputChange}
//                   readOnly={!isEditing.phone}
//                   className={`w-full mt-1 p-2 border rounded-lg dark:bg-gray-800 dark:text-white ${isEditing.phone ? "" : "bg-gray-200 cursor-not-allowed"}`}
//                 />
//               </div>
//               <FiEdit2 className="text-gray-500 cursor-pointer ml-3" onClick={() => toggleEdit("phone")} />
//             </div>
//           </div>

//           {/* ปุ่มบันทึกข้อมูล */}
//           {(isEditing.name || isEditing.phone) && (
//             <button
//               className="mt-4 flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600"
//               onClick={() => setIsEditing({ name: false, phone: false })}
//             >
//               <FiSave /> บันทึก
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";
import { useState, useEffect } from "react";
import { useUserStore } from "@/app/serviveAPI/GetUser/serviceUser";
import { FiUser, FiMail, FiPhone, FiUploadCloud, FiTrash2, FiEdit2, FiSave } from "react-icons/fi";
import Image from "next/image";

export default function PersonalProfile() {
  const { user, loading, fetchUserData, updateUserData, updateProfileImage } = useUserStore();
  const [isEditing, setIsEditing] = useState({ name: false, phone: false });
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [imageURL, setImageURL] = useState("/images/profile.png");

  useEffect(() => {
    if (!user) {
      const userId = sessionStorage.getItem("user_id");
      if (userId) fetchUserData(userId);
    } else {
      setFormData({ name: user.name || "", phone: user.phone || "" });
      setImageURL(user.avatar || "/images/profile.png");
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    await updateUserData(formData);
    setIsEditing({ name: false, phone: false });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-gray-700">🔄 กำลังโหลดข้อมูล...</div>;
  }

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 flex justify-center">
      <div className="w-full max-w-5xl grid grid-cols-3 gap-6">
        {/* ส่วนรูปโปรไฟล์ */}
        <div className="col-span-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center">
          <Image src={imageURL} alt="Profile" width={120} height={120} className="rounded-full border-4 border-gray-300 dark:border-gray-600" />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">อัปโหลดรูปได้สูงสุด 2MB</p>
          <div className="mt-3 flex flex-col gap-2 w-full">
            <button
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 w-full"
              onClick={() => updateProfileImage("/images/new-profile.png")}
            >
              <FiUploadCloud /> อัปโหลดรูป
            </button>
            <button
              className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg shadow hover:bg-gray-400 w-full"
              onClick={() => updateProfileImage("/images/profile.png")}
            >
              <FiTrash2 /> ลบรูป
            </button>
          </div>
        </div>

        {/* ส่วนข้อมูลส่วนตัว */}
        <div className="col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">ข้อมูลส่วนตัว</h2>
          <div className="mt-4 space-y-4">
            {/* ชื่อ */}
            <div className="border p-4 rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center justify-between">
              <div className="w-full">
                <label className="text-sm text-gray-500 dark:text-gray-400">ชื่อ - นามสกุล</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  readOnly={!isEditing.name}
                  className={`w-full mt-1 p-2 border rounded-lg dark:bg-gray-800 text-gray-900 dark:text-white ${isEditing.name ? "" : "bg-gray-200 cursor-not-allowed"}`}
                />
              </div>
              <FiEdit2 className="text-gray-500 cursor-pointer ml-3" onClick={() => setIsEditing({ ...isEditing, name: true })} />
            </div>

            {/* เบอร์โทรศัพท์ */}
            <div className="border p-4 rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center justify-between">
              <div className="w-full">
                <label className="text-sm text-gray-900 dark:text-gray-400">เบอร์โทรศัพท์</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  readOnly={!isEditing.phone}
                  className={`w-full mt-1 p-2 border rounded-lg dark:bg-gray-800 text-gray-900 dark:text-white ${isEditing.phone ? "" : "bg-gray-200 cursor-not-allowed"}`}
                />
              </div>
              <FiEdit2 className="text-gray-500 cursor-pointer ml-3" onClick={() => setIsEditing({ ...isEditing, phone: true })} />
            </div>
          </div>

          {/* ปุ่มบันทึก */}
          {(isEditing.name || isEditing.phone) && (
            <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600" onClick={handleSave}>
              <FiSave /> บันทึก
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
