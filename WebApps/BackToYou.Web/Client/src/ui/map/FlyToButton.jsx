import { useMap } from 'react-leaflet';

export default function FlyToButton({ userPosition, show }) {
  const map = useMap();

  if (!show) return null;

  const flyToUser = () => {
    map.flyTo(userPosition, 14, { duration: 1.5 });
  };

  return (
    <button
      onClick={flyToUser}
      style={{
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 1000,
        padding: '10px 15px',
        background: '#1976d2',
        color: '#fff',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
      }}
    >
      Quay về vị trí của tôi
    </button>
  );
}
