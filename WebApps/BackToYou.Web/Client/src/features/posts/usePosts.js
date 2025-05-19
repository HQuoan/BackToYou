import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPosts } from "../../services/apiPosts";
import { useLocation, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

export function usePosts({postLabel, categorySlug } = {}) {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  // ===== PAGINATION =====
  const pageNumber = Number(searchParams.get("PageNumber")) || 1;
  let pageSize = Number(searchParams.get("PageSize")) || 9;

  if (location.pathname === "/map") {
    searchParams.set("PageSize", "100");
    pageSize = 100;
  }

  const page = { pageNumber, pageSize };

  // ===== FILTER =====
  const from = searchParams.get("LostOrFoundDate.From");
  const to = searchParams.get("LostOrFoundDate.To");

  const filter = {
    keyword: searchParams.get("Keyword") || undefined,
    postLabel: searchParams.get("PostLabel") || postLabel || undefined,
    postType: searchParams.get("PostType") || undefined,
    categoryId: searchParams.get("CategoryId") || undefined,
    categorySlug: searchParams.get("CategorySlug") || categorySlug || undefined,
    province: searchParams.get("Province") || undefined,
    district: searchParams.get("District") || undefined,
    ward: searchParams.get("Ward") || undefined,
    "LostOrFoundDate.From": from || undefined,
    "LostOrFoundDate.To": to || undefined,
  };

  if (!from && !to) {
    delete filter["LostOrFoundDate.From"];
    delete filter["LostOrFoundDate.To"];
  }

  const {
    isPending,
    data,
    error,
  } = useQuery({
    queryKey: ["posts", page, filter],
    queryFn: () => getPosts({ page, filter }),
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const posts = data?.result ?? [];
  const pagination = data?.pagination ?? null;

  // ===== PREFETCH NEXT & PREV PAGES =====
  const totalPages = pagination?.totalPages ?? 0;

  if (pageNumber < totalPages) {
    const nextPage = { pageNumber: pageNumber + 1, pageSize };
    queryClient.prefetchQuery({
      queryKey: ["posts", nextPage, filter],
      queryFn: () => getPosts({ page: nextPage, filter }),
    });
  }

  if (pageNumber > 1) {
    const prevPage = { pageNumber: pageNumber - 1, pageSize };
    queryClient.prefetchQuery({
      queryKey: ["posts", prevPage, filter],
      queryFn: () => getPosts({ page: prevPage, filter }),
    });
  }

  return { isPending, error, posts, pagination };
}

