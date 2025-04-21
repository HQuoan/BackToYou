import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import mockPosts from './mockPosts';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

import MapLogic from './MapLogic';
import FlyToButton from './FlyToButton';

// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: markerIcon2x,
//   iconUrl: markerIcon,
//   shadowUrl: markerShadow,
// });

const defaultIcon = new L.Icon({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});



const userPosition = [10.762622, 106.660172];

const createAvatarIcon = (imgUrl) => {
  return L.divIcon({
    className: '',
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

export default function MapPage() {
  const [showBackButton, setShowBackButton] = useState(false);

  return (
    <div className='container' style={{ position: 'relative' }}>
      <MapContainer
        center={userPosition}
        zoom={14}
        style={{ height: '100vh', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <MapLogic setShowBackButton={setShowBackButton} />
        <FlyToButton userPosition={userPosition} show={showBackButton} />

        <Marker position={userPosition} icon={redIcon}>
          <Popup>Bạn đang ở đây</Popup>
        </Marker>

        {mockPosts.map((post) => (
          <Marker
            key={post.postId}
            position={[post.latitude, post.longitude]}
            icon={post.thumbnailUrl ? createAvatarIcon(post.thumbnailUrl) : undefined}
          >
            <Popup>
              <strong>{post.title}</strong><br />
              {post.thumbnailUrl && (
                <>
                  <img src={post.thumbnailUrl} alt={post.title} width="100%" /><br />
                </>
              )}
              {post.description}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
