"use client";
import React, { useState, useRef, useMemo, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, DivIcon } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FaMapMarkerAlt } from "react-icons/fa"; // ✅ นำเข้า FontAwesome
import "@fortawesome/fontawesome-free/css/all.min.css";


// ✅ ตำแหน่งศูนย์กลางเริ่มต้น (กรุงเทพฯ)
const center = {
  lat: 13.736717,
  lng: 100.523186,
};

// ✅ ใช้ DivIcon สำหรับ FontAwesome
const createFontAwesomeIcon = (color = "red") => {
  return L.divIcon({
    html: `<div style="
      font-size: 30px; 
      color: ${color};
      text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
      ">
      <i class="fas fa-map-marker-alt"></i>
    </div>`,
    className: "custom-marker-icon",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
};

const DraggableMarker = () => {
  const [draggable, setDraggable] = useState(false);
  const [position, setPosition] = useState(center);
  const markerRef = useRef(null);

  // ✅ จัดการเหตุการณ์ลาก (Drag)
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          setPosition(marker.getLatLng()); // ✅ อัปเดตตำแหน่งใหม่หลังจากลาก
        }
      },
    }),
    []
  );

  // ✅ ปิด/เปิดการลาก
  const toggleDraggable = useCallback(() => {
    setDraggable((d) => !d);
  }, []);

  return (
    <Marker
      draggable={draggable}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
      icon={createFontAwesomeIcon()} // ✅ ใช้ไอคอน FontAwesome ที่เราสร้าง
    >
      <Popup minWidth={90}>
        <span onClick={toggleDraggable} className="cursor-pointer text-blue-600 font-semibold">
          {draggable
            ? "📍 ลาก Marker ได้แล้ว!"
            : "🖱️ คลิกที่นี่เพื่อเปิดโหมดลาก Marker"}
        </span>
        <br />
        <small className="text-gray-500">
          ตำแหน่งปัจจุบัน: <br />
          🌍 Lat: {position.lat.toFixed(6)} <br />
          📍 Lng: {position.lng.toFixed(6)}
        </small>
      </Popup>
    </Marker>
  );
};

export default function MapWithDraggableMarker() {
  return (
    <div className="h-[500px] w-full">
      <MapContainer center={center} zoom={13} scrollWheelZoom={true} className="h-full w-full">
        {/* ✅ Tile Layer (Google Maps หรือ OpenStreetMap) */}
        <TileLayer
          attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* ✅ Marker แบบลากได้ */}
        <DraggableMarker />
      </MapContainer>
    </div>
  );
}
