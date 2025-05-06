import { useFormContext } from "react-hook-form";
import { useDistricts, useProvinces, useWards } from "../features/locations/useLocations";

function LocationSelector() {
  const { register, watch } = useFormContext();

  const province = watch("province");
  const district = watch("district");

  const { provinces } = useProvinces();
  // const { districts } = useDistricts(province ?? "", "");
  // const { wards } = useWards(district ?? "", "");

  const selectedProvinceCode = provinces.find(p => p.name === province)?.code ?? "";
  const { districts } = useDistricts(selectedProvinceCode, "");

  const selectedDistrictCode = districts.find(d => d.name === district)?.code ?? "";
  const { wards } = useWards(selectedDistrictCode, "");

  return (
    <>
      {/* <label className="form-label d-block mb-2 fw-semibold">Khu vực</label> */}

      <select className="form-select mb-2" {...register("province")}>
        <option value="">Tỉnh/Thành phố</option>
        {provinces.map((p) => (
          <option key={p.code} value={p.name}>{p.name}</option>
        ))}
      </select>

      <select className="form-select mb-2" {...register("district")} disabled={!province}>
        <option value="">Quận/Huyện</option>
        {districts.map((d) => (
          <option key={d.code} value={d.name}>{d.name}</option>
        ))}
      </select>

      <select className="form-select mb-2" {...register("ward")} disabled={!district}>
        <option value="">Phường/Xã</option>
        {wards.map((w) => (
          <option key={w.code} value={w.name}>{w.name}</option>
        ))}
      </select>
    </>
  );
}

export default LocationSelector;
