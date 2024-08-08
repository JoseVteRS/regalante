import { useQuery } from "@tanstack/react-query";
import { LISTS_QUERY_KEY } from "../lists-query-keys";
import { client } from "@/lib/hono";

export const useGetPublicList = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    retry: false,
    queryKey: [LISTS_QUERY_KEY.PUBLIC_LIST_ID, { id }],
    queryFn: async () => {
      const response = await client.api.lists.list[":id"].$get({
        param: { id },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch list");
      }
      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
