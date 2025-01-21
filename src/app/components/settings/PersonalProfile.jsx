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

  const auth = getAuth();
  const userId = auth.currentUser ? auth.currentUser.uid : null;

  useEffect(() => {
    console.log("Updated Image URL:", imageURL);
  }, [imageURL]);

  useEffect(() => {
    if (!userId) return;

    const fetchUserData = async () => {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
        setImageURL(userDoc.data().photoURL || ""); // Set default image URL
      } else {
        console.log("No such user!");
      }
    };
    fetchUserData();
  }, [userId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log("Selected file:", file);
    setImageFile(file);
  };

  const handleImageUpload = async () => {
    if (imageFile) {
      const imageRef = ref(storage, `profilePictures/${userId}`);
      try {
        console.log("Uploading image...");
        await uploadBytes(imageRef, imageFile);
        console.log("Image uploaded successfully.");
        const url = await getDownloadURL(imageRef);
        console.log("Image URL:", url);
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
      const photoURL = await handleImageUpload(); // Upload image if any
      const updatedData = { ...newData, photoURL };

      console.log("Updating Firestore with data:", updatedData);
      await updateDoc(doc(db, "users", userId), updatedData);

      setUserData((prev) => ({ ...prev, ...updatedData }));
      setIsEditing(false);
      console.log("Profile updated successfully.");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Personal Profile</h1>

      {/* Profile Picture */}
      <div className="mb-4 justify-start flex items-center">
        <img
          src={imageURL || "/images/profile.png"}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover mx-auto"
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

      {/* Profile Details */}
      <div className="space-y-4">
        {/* Name Section */}
        <div className="flex items-center justify-between border-b border-gray-300 pb-2">
          <div className="flex flex-col ml-4">
            <label className="text-sm font-medium text-gray-600">
              ชื่อ - นามสกุล
            </label>
            {isEditing ? (
              <input
                type="text"
                defaultValue={userData?.name || ""}
                onChange={(e) =>
                  setNewData({
                    ...newData,
                    name: e.target.value,
                  })
                }
                className="mt-1 w-full border rounded p-2"
              />
            ) : (
              <p className="mt-1 text-gray-700">{userData?.name || ""}</p>
            )}
          </div>
          {!isEditing && (
            <span
              className="text-blue-600 cursor-pointer mr-4"
              onClick={() => setIsEditing(true)}
            >
              แก้ไข
            </span>
          )}
        </div>

        {/* Phone Number Section */}
        <div className="flex items-center justify-between border-b border-gray-300 pb-2">
          <div className="flex flex-col ml-4">
            <label className="text-sm font-medium text-gray-600">
              เบอร์โทรศัพท์
            </label>
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
              <p className="mt-1 text-gray-700">
                {userData?.phoneNumber || ""}
              </p>
            )}
          </div>
          {!isEditing && (
            <span
              className="text-blue-600 cursor-pointer mr-4"
              onClick={() => setIsEditing(true)}
            >
              แก้ไข
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
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
