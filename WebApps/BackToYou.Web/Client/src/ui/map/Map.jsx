import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import MapLogic from './MapLogic';
import FlyToButton from './FlyToButton';
import mockPosts from '../../data/mockPosts';
import PostCard from '../PostCard';
import RedIcon from '../../utils/RedIcon';

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

export default function Map() {
  const [showBackButton, setShowBackButton] = useState(false);

  return (
    <div className="container map" style={{ position: 'relative' }}>
      <MapContainer
        center={userPosition}
        zoom={5}
        style={{ height: '80vh', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <MapLogic setShowBackButton={setShowBackButton} />
        <FlyToButton userPosition={userPosition} show={showBackButton} />

        <Marker position={userPosition} icon={RedIcon}>
          <Popup>Bạn đang ở đây</Popup>
        </Marker>

        {mockPosts.map((post) => (
          <Marker
            key={post.postId}
            position={[post.location.latitude, post.location.longitude]}
            icon={post.thumbnailUrl ? createAvatarIcon(post.thumbnailUrl) : undefined}
          >
            <Popup>
               <PostCard  post={post} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
