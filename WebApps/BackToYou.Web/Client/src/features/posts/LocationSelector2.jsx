import { useFormContext } from "react-hook-form";
import {
  useDistricts,
  useProvinces,
  useWards,
} from "./../locations/useLocations";

function LocationSelector2() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  const province = watch("province");
  const district = watch("district");

  const { provinces } = useProvinces();

  const selectedProvinceCode =
    provinces.find((p) => p.name === province)?.code ?? "";
  const { districts } = useDistricts(selectedProvinceCode, "");

  const selectedDistrictCode =
    districts.find((d) => d.name === district)?.code ?? "";
  const { wards } = useWards(selectedDistrictCode, "");

  return (
    <>
      <select
        className={`form-select mb-2 ${errors.province ? "is-invalid" : ""}`}
        {...register("province", { required: "Vui lòng chọn tỉnh/thành phố" })}
      >
        <option value="">Tỉnh/Thành phố</option>
        {provinces.map((p) => (
          <option key={p.code} value={p.name}>
            {p.name}
          </option>
        ))}
      </select>
      <select
        className={`form-select mb-2 ${errors.district ? "is-invalid" : ""}`}
        {...register("district", { required: "Vui lòng chọn quận/huyện" })}
        disabled={!province}
      >
        <option value="">Quận/Huyện</option>
        {districts.map((d) => (
          <option key={d.code} value={d.name}>
            {d.name}
          </option>
        ))}
      </select>
      <select
        className={`form-select mb-2 ${errors.ward ? "is-invalid" : ""}`}
        {...register("ward", {
          validate: (value) => {
            // Nếu có district code nhưng không có ward nào, thì cho phép bỏ trống
            if (selectedDistrictCode && wards.length === 0) return true;
            return value ? true : "Vui lòng chọn phường/xã";
          },
        })}
        disabled={!district}
      >
        <option value="">Phường/Xã</option>
        {wards.map((w) => (
          <option key={w.code} value={w.name}>
            {w.name}
          </option>
        ))}
      </select>
    </>
  );
}

export default LocationSelector2;
