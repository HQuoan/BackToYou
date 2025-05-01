import toast from "react-hot-toast";

export function getMyLocation(setValue) {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      setValue("latitude", latitude.toFixed(6));
      setValue("longitude", longitude.toFixed(6));
    },
    () => {
      toast.error("Không thể lấy vị trí của bạn.");
    }
  );
}

export async function geocodeAddress(address, setValue) {
  if (!address) return;

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
    );
    const data = await response.json();
    if (data && data[0]) {
      const { lat, lon } = data[0];
      setValue("latitude", parseFloat(lat).toFixed(6));
      setValue("longitude", parseFloat(lon).toFixed(6));
    } else {
      toast.error("Không tìm thấy vị trí phù hợp.");
    }
  } catch (error) {
    toast.error("Lỗi khi tìm vị trí.");
  }
}
