import { QueryConfig } from "@/components/Table/Table";
import { isNull, omitBy } from "lodash";
import { useSearchParams } from "next/navigation";

const useQueryConfig = () => {
  const searchParams: any = useSearchParams();

  const queryConfig: QueryConfig = omitBy(
    {
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || 10,
      name: searchParams.get("name"),
      phone: searchParams.get("phone"),
      email: searchParams.get("email"),
      address: searchParams.get("address"),
      sortOrder: searchParams.get("sortOrder"),
      sortBy: searchParams.get("sortBy"),
      lt: searchParams.get("lt"),
      gt: searchParams.get("gt"),
      status: searchParams.get("status"),
    },
    isNull
  );
  return queryConfig;
};

export default useQueryConfig;
