import { Marker, Popup } from "react-leaflet";
import { useEffect, useRef } from "react";

function MarkerCustom({ position, icon, text }) {
  const markerRef = useRef(null);
  // const map = useMap();

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.openPopup();
      // map.setView(position, 8); // zoom vào vị trí, zoom level có thể điều chỉnh
    }
  }, []);

  return (
    <Marker position={position} icon={icon} ref={markerRef}>
      <Popup>{text}</Popup>
    </Marker>
  );
}

export default MarkerCustom;
