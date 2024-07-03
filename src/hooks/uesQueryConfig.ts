import { QueryConfig } from "@/components/Table/Table";
import { isNull, omitBy } from "lodash";
import { useSearchParams } from "next/navigation";

const useQueryConfig = () => {
  const searchParams: any = useSearchParams();

  const queryConfig: QueryConfig = omitBy(
    {
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || 10,
      sort_by: searchParams.get("sort_by"),
      name: searchParams.get("name"),
      phone: searchParams.get("phone"),
      email: searchParams.get("email"),
      address: searchParams.get("address"),
    },
    isNull
  );
  return queryConfig;
};

export default useQueryConfig;
