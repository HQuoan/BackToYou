import { useEffect } from "react";
import { useMap, useMapEvents } from "react-leaflet";
import { useFormContext } from "react-hook-form";

function LocationMapSelector({ lat, lng, lock }) {
  const { setValue } = useFormContext();
  const map = useMap();

  useMapEvents({
    click(e) {
      if (!lock) {
        setValue("latitude", e.latlng.lat.toFixed(6));
        setValue("longitude", e.latlng.lng.toFixed(6));
      }
    },
  });

  useEffect(() => {
    map.flyTo([lat, lng], 14, { duration: 1.5 });
  }, [lat, lng, map]);

  return null;
}

export default LocationMapSelector;
