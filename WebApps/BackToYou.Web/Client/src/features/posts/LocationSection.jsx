import { useFormContext } from "react-hook-form";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-fullscreen";
import "leaflet-fullscreen/dist/leaflet.fullscreen.css";

import markerShadow from "leaflet/dist/images/marker-shadow.png";
const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function LocationSection() {
  const { register, setValue, watch } = useFormContext();
  const lat = parseFloat(watch("latitude")) || 51.505;
  const lng = parseFloat(watch("longitude")) || -0.09;
  const [lock, setLock] = useState(true);
  const [showManual, setShowManual] = useState(false);

  function LocationSelector() {
    const map = useMap();

    useMapEvents({
      click(e) {
        if (!lock) {
          setValue("latitude", e.latlng.lat.toFixed(6));
          setValue("longitude", e.latlng.lng.toFixed(6));
        }
      },
    });

    // Fly to whenever lat/lng change
    useEffect(() => {
      map.flyTo([lat, lng], 14, { duration: 1.5 });
    }, [lat, lng, map]);

    return null;
  }

  const getMyLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setValue("latitude", latitude.toFixed(6));
        setValue("longitude", longitude.toFixed(6));
      },
      (err) => {
        alert("Không thể lấy vị trí của bạn.");
      }
    );
  };

  const geocodeAddress = async (address) => {
    if (!address) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}`
      );
      const data = await response.json();
      if (data && data[0]) {
        const { lat, lon } = data[0];
        setValue("latitude", parseFloat(lat).toFixed(6));
        setValue("longitude", parseFloat(lon).toFixed(6));
      } else {
        alert("Không tìm thấy vị trí phù hợp.");
      }
    } catch (error) {
      alert("Lỗi khi tìm vị trí.");
    }
  };

  return (
    <div id="location" className="section mb-5 rounded card">
      <div className="card-header d-flex align-items-center">
        <span className="icon-circle me-2">
          <i className="bi bi-geo-alt"></i>
        </span>
        <h5 className="mb-0">Địa chỉ</h5>
      </div>
      <div className="card-body">
        <div className="mb-3">
          <label className="form-label fw-bold">Địa chỉ rơi</label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder='e.g. "123 Nguyễn Trãi, Hà Nội"'
              {...register("address")}
            />
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => geocodeAddress(watch("address"))}
            >
              🔍
            </button>
            <button
              className="btn btn-outline-primary"
              type="button"
              onClick={getMyLocation}
            >
              Tôi
            </button>
          </div>
        </div>

        <div className="mb-3 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <i className="bi bi-lock-fill me-2"></i>
            <button
              type="button"
              className="btn btn-link p-0"
              onClick={() => setLock((prev) => !prev)}
            >
              {lock ? "Unlock Pin Location" : "Lock Pin Location"}
            </button>
          </div>
          <button
            type="button"
            className="btn btn-link p-0"
            onClick={() => setShowManual((prev) => !prev)}
          >
            {showManual ? "Hide manual input" : "Enter coordinates manually"}
          </button>
        </div>

        {showManual && (
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Latitude</label>
              <input
                type="text"
                className="form-control"
                {...register("latitude")}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Longitude</label>
              <input
                type="text"
                className="form-control"
                {...register("longitude")}
              />
            </div>
          </div>
        )}

        <div className="mb-3" style={{ height: "350px" }}>
          <MapContainer
            center={[lat, lng]}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
            fullscreenControl={true}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            />
            <Marker position={[lat, lng]} icon={redIcon} />
            <LocationSelector />
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

export default LocationSection;
