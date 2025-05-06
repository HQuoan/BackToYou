import { useFormContext } from "react-hook-form";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { useState } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-fullscreen";
import "leaflet-fullscreen/dist/leaflet.fullscreen.css";

import { geocodeAddress, getMyLocation } from "../../utils/locationHelpers";
import RedIcon from "../../utils/RedIcon";
import LocationMapSelector from "./LocationMapSelector";
import LocationSelector from "./../../ui/LocationSelector";

function LocationSection() {
  const { register, setValue, watch } = useFormContext();
  const lat = parseFloat(watch("latitude")) || 21.028333;
  const lng = parseFloat(watch("longitude")) || 105.854041;
  const [lock, setLock] = useState(true);
  const [showManual, setShowManual] = useState(false);

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
          <div className="d-flex listing-page">
            <LocationSelector />
          </div>
          <div className="input-group">
            <input
              type="search"
              className="form-control"
              placeholder='e.g. "131 Nguyễn Chánh"'
              {...register("streetAddress")}
            />
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() =>
                geocodeAddress(
                  [watch("streetAddress"), watch("ward"), watch("district"), watch("province")]
                    .filter(Boolean)
                    .join(", "),
                  setValue
                )
              }
            >
              <i className="bi bi-search"></i>
            </button>
            <button
              className="btn btn-outline-success"
              type="button"
              onClick={() => getMyLocation(setValue)}
            >
              <i className="bi bi-crosshair"></i>
            </button>
          </div>
        </div>

        <div className="mb-3 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            {lock ? (
              <i className="bi bi-lock-fill me-2 text-primary-custom"></i>
            ) : (
              <i className="bi bi-unlock-fill me-2 text-primary-custom"></i>
            )}
            <button
              type="button"
              className="btn btn-link-custom p-0"
              onClick={() => setLock((prev) => !prev)}
            >
              {lock ? "Unlock Pin Location" : "Lock Pin Location"}
            </button>
          </div>
          <button
            type="button"
            className="btn btn-link-custom p-0"
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
            <Marker position={[lat, lng]} icon={RedIcon} />
            <LocationMapSelector lat={lat} lng={lng} lock={lock} />
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

export default LocationSection;
