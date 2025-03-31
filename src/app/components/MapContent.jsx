"use client";
import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useSensorStore } from "@/app/serviveAPI/LoadDataSensor/ServiceLoadData";

// ตั้งค่า Default Marker
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const SensorMapAllMarkers = ({ selectedSensor }) => {
  const { sensorData } = useSensorStore();

  const selected = sensorData[selectedSensor];
  const environmental = selected?.environmental || [];

  const latEntry = environmental.find((e) => e.param?.toLowerCase() === "gps_latitude");
  const lngEntry = environmental.find((e) => e.param?.toLowerCase() === "gps_longitude");

  const lat = parseFloat(latEntry?.readings?.[0]?.value);
  const lng = parseFloat(lngEntry?.readings?.[0]?.value);

  const center = !isNaN(lat) && !isNaN(lng)
    ? { lat, lng }
    : { lat: 13.736717, lng: 100.523186 }; // fallback

  const SensorMapUpdater = () => {
    const map = useMap();

    useEffect(() => {
      if (!isNaN(lat) && !isNaN(lng)) {
        map.flyTo([lat, lng], 13, { duration: 1 });
      }
    }, [lat, lng, map]);

    return null;
  };

  if (isNaN(lat) || isNaN(lng)) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-300 py-4">
        ❌ ไม่พบพิกัด GPS ของเซ็นเซอร์ที่เลือก
      </div>
    );
  }

  return (
    <div className="h-full w-full rounded-lg overflow-hidden shadow-md">
      <MapContainer center={center} zoom={13} scrollWheelZoom={true} className="h-full w-full">
        <SensorMapUpdater />

        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={center}>
          <Popup>
            <strong>{selected.sensor_name || `Sensor ${selectedSensor}`}</strong><br />
            🌍 Lat: {lat.toFixed(6)}<br />
            📍 Lng: {lng.toFixed(6)}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default SensorMapAllMarkers;
