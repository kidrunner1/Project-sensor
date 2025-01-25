"use client";
import { useState, useEffect } from "react";
import { db, storage } from "../../firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { getAuth } from "firebase/auth";

export default function PersonalProfile() {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newData, setNewData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imageURL, setImageURL] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const auth = getAuth();
  const user = auth.currentUser;
  const userId = user?.uid;

  useEffect(() => {
    if (!userId) return;

    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
          setImageURL(userDoc.data().photoURL || "/images/profile.png");
        } else {
          console.error("User data not found.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const handleImageUpload = async () => {
    if (imageFile) {
      const imageRef = ref(storage, `profilePictures/${userId}`);
      try {
        await uploadBytes(imageRef, imageFile);
        const url = await getDownloadURL(imageRef);
        setImageURL(url);
        return url;
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
    return imageURL;
  };

  const handleUpdate = async () => {
    if (!userId) return;

    try {
      const photoURL = await handleImageUpload();
      const updatedData = { ...newData, photoURL };

      await updateDoc(doc(db, "users", userId), updatedData);

      setUserData((prev) => ({ ...prev, ...updatedData }));
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const displayNameOrName = user?.displayName || userData?.name || "No Name";

  return (
    <div className="mx-4 md:mx-6 lg:mx-8 p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Personal Profile</h1>

      {/* Profile Picture */}
      <div className="mb-4 flex flex-col items-center">
        <img
          src={imageURL}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover"
        />
        {isEditing && (
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-2"
          />
        )}
      </div>

      {/* Email */}
      <div className="border-b pb-2">
        <label className="text-sm font-medium">อีเมล</label>
        <p className="mt-1">{user?.email || "No Email"}</p>
      </div>

      {/* Name */}
      <div className="border-b pb-2 mt-6">
        <label className="text-sm font-medium">ชื่อ - นามสกุล</label>
        {isEditing ? (
          <input
            type="text"
            defaultValue={displayNameOrName}
            onChange={(e) => setNewData({ ...newData, name: e.target.value })}
            className="mt-1 w-full border rounded p-2"
          />
        ) : (
          <p className="mt-1">{displayNameOrName}</p>
        )}
      </div>

      {/* Phone Number */}
      <div className="border-b pb-2 mt-6">
        <label className="text-sm font-medium">เบอร์โทรศัพท์</label>
        {isEditing ? (
          <input
            type="text"
            defaultValue={userData?.phoneNumber || ""}
            onChange={(e) =>
              setNewData({ ...newData, phoneNumber: e.target.value })
            }
            className="mt-1 w-full border rounded p-2"
          />
        ) : (
          <p className="mt-1">{userData?.phoneNumber || "No Phone Number"}</p>
        )}
      </div>

      <div className="mt-6 flex gap-4 ">
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
