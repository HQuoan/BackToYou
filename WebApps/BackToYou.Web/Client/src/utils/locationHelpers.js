import toast from "react-hot-toast";

// const defaultPosition = [21.028511, 105.804817]; // hà nội

// export function getMyLocation(setValue) {
//   navigator.geolocation.getCurrentPosition(
//     (pos) => {
//       const { latitude, longitude } = pos.coords;
//       setValue("latitude", latitude.toFixed(6));
//       setValue("longitude", longitude.toFixed(6));
//     },
//     () => {
//       toast.error("Không thể lấy vị trí của bạn.");
//     }
//   );
// }

const defaultPosition = [21.028511, 105.804817]; // Hà Nội

export function getMyLocation(setValue) {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      setValue("latitude", latitude.toFixed(6));
      setValue("longitude", longitude.toFixed(6));
    },
    () => {
      toast.error("Không thể lấy vị trí của bạn. Đang sử dụng vị trí mặc định (Hà Nội).");
      const [lat, lng] = defaultPosition;
      setValue("latitude", lat.toFixed(6));
      setValue("longitude", lng.toFixed(6));
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
