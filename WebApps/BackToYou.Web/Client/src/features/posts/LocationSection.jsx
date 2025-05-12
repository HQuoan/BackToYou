import { useFormContext } from "react-hook-form";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-fullscreen";
import "leaflet-fullscreen/dist/leaflet.fullscreen.css";

import { geocodeAddress, getMyLocation } from "../../utils/locationHelpers";
import RedIcon from "../../utils/RedIcon";
import LocationMapSelector from "./LocationMapSelector";
import LocationSelector2 from "./LocationSelector2";

const hoangSaPosition = [16.831089, 112.33289];
const truongSaPosition = [9.549071, 112.887067];

function LocationSection({ setShowManual, showManual }) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const lat = parseFloat(watch("latitude")) || 21.028333;
  const lng = parseFloat(watch("longitude")) || 105.854041;
  const [lock, setLock] = useState(true);

  useEffect(() => {
    register("latitude", {
      required: "Vui lòng nhập latitude",
      validate: (value) => !isNaN(value) || "Latitude phải là số",
    });
    register("longitude", {
      required: "Vui lòng nhập longitude",
      validate: (value) => !isNaN(value) || "Longitude phải là số",
    });
  }, [register]);

  useEffect(() => {
    if (errors.latitude || errors.longitude) {
      setShowManual(true);
    }
  }, [errors, setShowManual]);

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
            <LocationSelector2 />
          </div>

          {errors.province && (
            <div className="text-danger">{errors.province.message}</div>
          )}
          {errors.district && (
            <div className="text-danger">{errors.district.message}</div>
          )}
          {errors.ward && (
            <div className="text-danger">{errors.ward.message}</div>
          )}

          <div className="input-group mt-2">
            <input
              type="search"
              className="form-control"
              placeholder='e.g. "131 Nguyễn Chánh"'
              {...register("streetAddress")}
              //  {...register("streetAddress", {
              //   required: "Vui lòng nhập địa chỉ",
              // })}
            />
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() =>
                geocodeAddress(
                  [
                    watch("streetAddress"),
                    watch("ward"),
                    watch("district"),
                    watch("province"),
                  ]
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
          {/* {errors.streetAddress && (
            <div className="text-danger mt-1">
              {errors.streetAddress.message}
            </div>
          )} */}
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
              <label className="form-label fw-semibold">Latitude</label>
              <input
                type="text"
                className={`form-control ${errors.latitude ? "is-invalid" : ""}`}
                {...register("latitude", {
                  required: "Vui lòng nhập latitude",
                  validate: (value) => !isNaN(value) || "Latitude phải là số",
                })}
              />
              {errors.latitude && (
                <div className="text-danger mt-1">
                  {errors.latitude.message}
                </div>
              )}
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Longitude</label>
              <input
                type="text"
                className={`form-control ${errors.longitude ? "is-invalid" : ""}`}
                {...register("longitude", {
                  required: "Vui lòng nhập longitude",
                  validate: (value) => !isNaN(value) || "Longitude phải là số",
                })}
              />
              {errors.longitude && (
                <div className="text-danger mt-1">
                  {errors.longitude.message}
                </div>
              )}
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
              // attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            />
            <Marker position={[lat, lng]} icon={RedIcon} />

            <Marker position={hoangSaPosition} icon={RedIcon}>
              <Popup>Hoàng Sa là của Việt Nam</Popup>
            </Marker>

            <Marker position={truongSaPosition} icon={RedIcon}>
              <Popup>Trường Sa là của Việt Nam</Popup>
            </Marker>
            <LocationMapSelector lat={lat} lng={lng} lock={lock} />
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

export default LocationSection;
