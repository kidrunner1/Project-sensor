"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import ipconfig from "@/app/ipconfig";

export default function PersonalProfile() {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newData, setNewData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imageURL, setImageURL] = useState("/images/profile.png");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        router.push("/login");
        return;
      }

      try {
        const response = await axios.get(`http://${ipconfig.API_HOST}/api/user/profile`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (response.data) {
          setUserData(response.data);
          setImageURL(response.data.avatar || "/images/profile.png");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const handleImageUpload = async () => {
    if (!imageFile) return imageURL;

    const formData = new FormData();
    formData.append("avatar", imageFile);

    try {
      const accessToken = localStorage.getItem("access_token");
      const response = await axios.post(
        `http://${ipconfig.API_HOST}/api/user/upload-avatar`,
        formData,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      setImageURL(response.data.avatar_url);
      return response.data.avatar_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      return imageURL;
    }
  };

  const handleUpdate = async () => {
    try {
      setIsLoading(true);
      const accessToken = localStorage.getItem("access_token");

      const photoURL = await handleImageUpload();
      const updatedData = { ...newData, avatar: photoURL };

      await axios.put(`http://${ipconfig.API_HOST}/api/user/update`, updatedData, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      setUserData((prev) => ({ ...prev, ...updatedData }));
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-4 md:mx-6 lg:mx-8 p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Personal Profile</h1>

      {/* Profile Picture */}
      <div className="mb-4 flex flex-col items-center">
        <img src={imageURL} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
        {isEditing && <input type="file" accept="image/*" onChange={handleFileChange} className="mt-2" />}
      </div>

      {/* Email */}
      <div className="border-b pb-2">
        <label className="text-sm font-medium">อีเมล</label>
        <p className="mt-1">{userData?.email || "No Email"}</p>
      </div>

      {/* Name */}
      <div className="border-b pb-2 mt-6">
        <label className="text-sm font-medium">ชื่อ - นามสกุล</label>
        {isEditing ? (
          <input
            type="text"
            defaultValue={userData?.name || ""}
            onChange={(e) => setNewData({ ...newData, name: e.target.value })}
            className="mt-1 w-full border rounded p-2"
          />
        ) : (
          <p className="mt-1">{userData?.name || "No Name"}</p>
        )}
      </div>

      {/* Phone Number */}
      <div className="border-b pb-2 mt-6">
        <label className="text-sm font-medium">เบอร์โทรศัพท์</label>
        {isEditing ? (
          <input
            type="text"
            defaultValue={userData?.phone || ""}
            onChange={(e) => setNewData({ ...newData, phone: e.target.value })}
            className="mt-1 w-full border rounded p-2"
          />
        ) : (
          <p className="mt-1">{userData?.phone || "No Phone Number"}</p>
        )}
      </div>

      <div className="mt-6 flex gap-4">
        {isEditing ? (
          <>
            <button
              onClick={handleUpdate}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              บันทึกข้อมูล
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              ยกเลิก
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            แก้ไขข้อมูล
          </button>
        )}
      </div>
    </div>
  );
}
