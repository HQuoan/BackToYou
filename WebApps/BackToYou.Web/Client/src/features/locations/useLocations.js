import { useQuery } from "@tanstack/react-query";
import { getDistricts, getProvinces, getWards } from "../../services/apiLocations";

export function useProvinces(name) {
  const { isPending, data, error } = useQuery({
    queryKey: ["provinces", name],
    queryFn: () => getProvinces(name),
  });

  const provinces = data?.result ?? [];
  const pagination = data?.pagination ?? null;

  return { isPending, error, provinces, pagination };
}

export function useDistricts(provinceCode, name) {
  const enabled = Boolean(provinceCode);

  const { isPending, data, error } = useQuery({
    queryKey: ["districts", provinceCode, name],
    queryFn: () => getDistricts(provinceCode, name),
    enabled, // <-- chỉ gọi nếu có provinceCode
  });

  const districts = data?.result ?? [];
  const pagination = data?.pagination ?? null;

  return { isPending, error, districts, pagination };
}

export function useWards(districtCode, name) {
  const enabled = Boolean(districtCode);

  const { isPending, data, error } = useQuery({
    queryKey: ["wards", districtCode, name],
    queryFn: () => getWards(districtCode, name),
    enabled, // <-- chỉ gọi nếu có districtCode
  });

  const wards = data?.result ?? [];
  const pagination = data?.pagination ?? null;

  return { isPending, error, wards, pagination };
}
