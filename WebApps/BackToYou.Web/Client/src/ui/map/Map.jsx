import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import MapLogic from "./MapLogic";
import FlyToButton from "./FlyToButton";
import mockPosts from "../../data/mockPosts";
import PostCard from "../PostCard";
import RedIcon from "../../utils/RedIcon";
import { usePosts } from "../../features/posts/usePosts";
import Spinner from "../Spinner";
import Pagination from "../Pagination";
import { getMyLocation } from "../../utils/locationHelpers";

const defaultPosition = [21.028511, 105.804817]; // Hà Nội

const createAvatarIcon = (imgUrl) => {
  return L.divIcon({
    className: "",
    html: `<div style="
      width: 40px;
      height: 40px;
      border-radius: 50%;
      overflow: hidden;
      border: 2px solid #fff;
      box-shadow: 0 0 4px rgba(0,0,0,0.4);
      background-size: cover;
      background-image: url('${imgUrl}');
    "></div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

export default function Map() {
  const [userPosition, setUserPosition] = useState(defaultPosition); // 👈 dùng state
  const [showBackButton, setShowBackButton] = useState(false);
  const { isPending, posts, pagination } = usePosts();
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    // Gọi getMyLocation để lấy vị trí hoặc dùng mặc định
    getMyLocation((key, value) => {
      if (key === "latitude") {
        setUserPosition((prev) => [parseFloat(value), prev[1]]);
      } else if (key === "longitude") {
        setUserPosition((prev) => [prev[0], parseFloat(value)]);
      }
    });
  }, []);

  useEffect(() => {
    let timeout;
    if (isPending) {
      setShowSpinner(true);
    } else {
      timeout = setTimeout(() => setShowSpinner(false), 300);
    }
    return () => clearTimeout(timeout);
  }, [isPending]);

  return (
    <>
      <div className="container map" style={{ position: "relative" }}>
        <MapContainer
          center={userPosition}
          zoom={5}
          style={{ height: "80vh", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <MapLogic setShowBackButton={setShowBackButton} />
          <FlyToButton userPosition={userPosition} show={showBackButton} />

          <Marker position={userPosition} icon={RedIcon}>
            <Popup>Bạn đang ở đây</Popup>
          </Marker>

          {showSpinner ? (
            <Spinner />
          ) : (
            posts.map((post) => (
              <Marker
                key={post.postId}
                position={[post.location.latitude, post.location.longitude]}
                icon={
                  post.thumbnailUrl
                    ? createAvatarIcon(post.thumbnailUrl)
                    : undefined
                }
              >
                <Popup>
                  <PostCard post={post} />
                </Popup>
              </Marker>
            ))
          )}
        </MapContainer>
      </div>
      <div className="row">
        <Pagination pagination={pagination} pageSize={100} />
      </div>
    </>
  );
}
