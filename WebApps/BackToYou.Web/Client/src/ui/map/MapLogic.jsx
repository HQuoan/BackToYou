import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

const userPosition = [10.762622, 106.660172];

function haversineDistance(latlng1, latlng2) {
  const toRad = (deg) => deg * (Math.PI / 180);
  const R = 6371e3; // meters
  const φ1 = toRad(latlng1[0]);
  const φ2 = toRad(latlng2[0]);
  const Δφ = toRad(latlng2[0] - latlng1[0]);
  const Δλ = toRad(latlng2[1] - latlng1[1]);

  const a =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export default function MapLogic({ setShowBackButton }) {
  const map = useMap();

  useEffect(() => {
    const onMoveEnd = () => {
      const center = map.getCenter();
      const dist = haversineDistance([center.lat, center.lng], userPosition);
      setShowBackButton(dist > 500);
    };

    map.on('moveend', onMoveEnd);
    return () => map.off('moveend', onMoveEnd);
  }, [map, setShowBackButton]);

  return null;
}
