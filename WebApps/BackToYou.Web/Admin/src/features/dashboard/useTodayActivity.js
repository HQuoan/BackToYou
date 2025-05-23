import { useQuery } from "@tanstack/react-query";
import { getPosts } from "../../services/apiPost";
import { getVietnamTime } from "../../utils/helpers";

export function useTodayActivity() {
  const vietnamNow = getVietnamTime();

  const filter = {
    "CreatedAt.From": vietnamNow.toISOString(),
    "CreatedAt.To": vietnamNow.toISOString(),
  };

  const { isLoading, data } = useQuery({
    queryFn: () => getPosts({ filter }),
    queryKey: ["today-activity"],
  });

  const activities = data?.result ?? [];
  const pagination = data?.pagination ?? null;

  return { activities, isLoading, pagination };
}
