import { create } from "zustand";

// ✅ ตัวอย่างข้อมูล Mock แจ้งเตือน (ถ้าไม่มี API จริง)
const mockNotifications = [
  { id: 1, message: "ค่าก๊าซ CO สูงเกินกำหนด!", read: false },
  { id: 2, message: "ระบบตรวจสอบแล้วว่าอากาศอยู่ในเกณฑ์ปกติ", read: true },
  { id: 3, message: "แจ้งเตือนการบำรุงรักษาเซ็นเซอร์", read: false },
];

// ✅ สร้าง Zustand Store สำหรับแจ้งเตือน
export const useNotificationStore = create((set) => ({
  notifications: [], // 🟡 เก็บรายการแจ้งเตือน
  fetchNotifications: async () => {
    try {
      // 📌 ถ้ามี API จริงให้ใช้ fetch API ตรงนี้แทน
      // const response = await fetch("/api/notifications");
      // const data = await response.json();

      set({ notifications: mockNotifications }); // ⬅️ ใช้ Mock Data แทน
    } catch (error) {
      console.error("❌ ไม่สามารถโหลดข้อมูลแจ้งเตือนได้:", error);
    }
  },
  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
  },
}));
