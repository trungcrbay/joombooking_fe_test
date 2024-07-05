"use client";
import { ISearchUser, userApi } from "@/api/user.api";
import { IUser, IUserListConfig } from "@/types/users.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  GetProp,
  Table,
  TableProps,
  Flex,
  Button,
  Input,
  Select,
  message,
  Modal,
  Badge,
  RadioChangeEvent,
} from "antd";
import { Eye, FilterIcon, Pencil, Search } from "lucide-react";
import React, { useState } from "react";
import ModalViewUser from "../Modal/ModalViewUser/ModalViewUser";
import ModalUpdateUser from "../Modal/ModalUpdateUser/ModalUpdateUser";
import ExportData from "../DataEntry/Export/ExportData";
import ImportData from "../DataEntry/Import/ImportData";
import ModalAddUser from "../Modal/ModalAddUser/ModalAddUser";
import "./table.css";
import { useDebounce } from "@/hooks/useDebounce";
import DeleteUser from "../DataEntry/Delete/DeleteUser";
import useQueryConfig from "@/hooks/uesQueryConfig";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import DrawerFilter from "../Filter/DrawerFilter";

export type QueryConfig = {
  [key in keyof IUserListConfig]: string;
};

type TablePaginationConfig = Exclude<
  GetProp<TableProps, "pagination">,
  boolean
>;

type ColumnsType<T> = TableProps<T>["columns"];

interface TableParams {
  pagination?: TablePaginationConfig;
  filters?: Parameters<GetProp<TableProps, "onChange">>[1];
}

const UserTable = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataView, setDataView] = useState<IUser | null>(null);
  const [isViewUser, setIsViewUser] = useState(false);
  const [searchType, setSearchType] = useState("name");
  const [isModalAddUser, setIsModalAddUser] = useState(false);
  const [isDeleteMany, setIsDeleteMany] = useState(false);
  const [isUpdateUser, setIsUpdateUser] = useState(false);
  const [isOpenFilter, setIsOpenFilter] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<string[]>([]);
  const [value, setValue] = useState(1);

  const queryClient = useQueryClient();
  const [searchTitle, setSearchTitle] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();
  const newParams = new URLSearchParams(params.toString());
  const queryConfig = useQueryConfig();
  const {
    limit,
    page,
    sortBy,
    sortOrder,
    name,
    address,
    email,
    phone,
    status,
    gt,
    lt,
  } = queryConfig;
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: Number(page),
      pageSize: Number(limit),
      showSizeChanger: true,
      responsive: true,
    },
  });

  const searchQuery = useDebounce(
    searchTitle,
    500,
    async () => {}
  ) as ISearchUser;

  const columns: ColumnsType<IUser> = [
    {
      title: "User id",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text, record) => {
        return (
          <Badge
            status={record.status ? "success" : "error"}
            text={record.status ? "Active" : "Inactive"}
          />
        );
      },
    },
    {
      title: "Action",
      render: (text, record, index) => {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <Eye
              onClick={() => {
                setIsViewUser(true);
                setDataView(record);
              }}
              className="cursor-pointer"
              fillRule="evenodd"
            />
            <Pencil
              className="cursor-pointer"
              onClick={() => {
                setIsUpdateUser(true);
                setDataView(record);
              }}
            />
            <DeleteUser dataView={record} />
          </div>
        );
      },
    },
  ];

  console.log("queryConfig:", queryConfig);

  const rowSelection = {
    onChange: (selectedRowKeys: string[], selectedRows: IUser[]) => {
      setSelectedUserId(selectedRowKeys);
      if (selectedRowKeys.length > 0) {
        setIsDeleteMany(true);
      } else {
        setIsDeleteMany(false);
      }
    },
    getCheckboxProps: (record: IUser) => ({
      _id: record._id,
    }),
  };

  const handleFetchDataUsers = async () => {
    try {
      setLoading(true);
      const usersData = await userApi.queryUser(queryConfig as IUserListConfig);
      if (usersData) {
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: usersData.data.data.pagination.total,
            showTotal: (total, range) => {
              return (
                <div className="hidden md:block">
                  {range[0]}-{range[1]} trên {total} rows
                </div>
              );
            },
          },
        });
        setLoading(false);
      }
      return usersData;
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const { data } = useQuery({
    queryKey: [
      "users",
      tableParams.pagination?.current,
      tableParams.pagination?.pageSize,
      tableParams?.pagination?.showTotal,
      page,
      limit,
      sortBy,
      status,
      gt,
      lt,
      sortOrder,
      name,
      address,
      email,
      phone,
      users,
      searchQuery,
      searchTitle,
    ],
    queryFn: handleFetchDataUsers,
  });

  const handleTableChange: TableProps["onChange"] = (pagination, filters) => {
    setTableParams({
      pagination,
      filters,
    });

    const { current, pageSize } = pagination;

    newParams.set("page", String(current));
    newParams.set("limit", String(pageSize));

    router.push(`${pathname}?${newParams.toString()}`);

    setTableParams({
      ...tableParams,
      pagination,
    });

    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setUsers([]);
    }
  };

  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
    setSearchType(value);
    setSearchTitle({
      name: "",
      phone: "",
      email: "",
      address: "",
    });
  };

  const handleDeleteUsers = useMutation({
    mutationFn: (usersId: string[]) => {
      return userApi.deleteManyUser(usersId);
    },
    onSuccess: (data) => {
      message.success(data.data.message);
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setSelectedUserId([]);
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const deleteManyUser = () => {
    if (selectedUserId.length > 0) {
      handleDeleteUsers.mutate(selectedUserId);
      setIsDeleteMany(false);
    }
  };

  const modalWarning = () => {
    Modal.warning({
      title: `Are you sure to delete ${selectedUserId.length} users`,
      content: "If OK, there wouldn't be undo. Please be careful!",
      onOk: deleteManyUser,
      closable: true,
    });
  };

  const onSubmitSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    newParams.delete("name");
    newParams.delete("address");
    newParams.delete("phone");
    newParams.delete("email");
    if (searchTitle) {
      searchType === "name" && newParams.set("name", searchTitle.name);
      searchType === "address" && newParams.set("address", searchTitle.address);
      searchType === "phone" && newParams.set("phone", searchTitle.phone);
      searchType === "email" && newParams.set("email", searchTitle.email);
    }
    router.replace(`${pathname}?${newParams.toString()}`);
  };
  return (
    <>
      <h2 className="text-[20px] md:text-[28px] font-bold flex justify-center w-full">
        Welcome to Joombooking
      </h2>
      <p className="text-base md:text-[20px] flex justify-center w-full leading-relaxed	 md:leading-none mt-8">
        A software development company, which provides booking solution for
        travel industry
      </p>

      <Flex className="flex-col md:flex-row gap-0 md:gap-4 md:items-center items-start md:mt-8">
        <Button
          size="middle"
          htmlType="button"
          type="primary"
          onClick={() => setIsModalAddUser(true)}
          className="my-4 overflow-hidden"
        >
          Add New User
        </Button>

        <ImportData />

        <ExportData data={users} fileName="user" />

        <p>Search for</p>

        <Select
          defaultValue="name"
          style={{ width: 120 }}
          onChange={handleChange}
          options={[
            { value: "name", label: "Name" },
            { value: "phone", label: "Phone" },
            { value: "address", label: "Address" },
            { value: "email", label: "Email" },
          ]}
        />

        <form
          className="md:w-[400px] w-full h-[100%] py-4 flex"
          onSubmit={onSubmitSearch}
        >
          <Input
            size="small"
            className="md:w-[200px] "
            style={{ padding: "10px 12px", borderRadius: "8px 0 0 8px" }}
            placeholder="Search..."
            name={searchType}
            value={
              searchTitle.name ||
              searchTitle.address ||
              searchTitle.email ||
              searchTitle.phone
            }
            onChange={(e) => {
              const { name, value } = e.target;
              setSearchTitle((prevState) => ({
                ...prevState,
                [name]: value,
              }));
            }}
          />

          <Button
            type="primary"
            htmlType="submit"
            style={{ borderRadius: "0 8px 8px 0", height: "auto" }}
          >
            <Search />
          </Button>
        </form>
      </Flex>

      <FilterIcon
        className="cursor-pointer"
        onClick={() => setIsOpenFilter(true)}
      />

      <DrawerFilter
        isOpenFilter={isOpenFilter}
        setIsOpenFilter={setIsOpenFilter}
      />

      {isDeleteMany && (
        <Button
          size="middle"
          htmlType="button"
          danger
          onClick={modalWarning}
          className="my-4 overflow-hidden"
        >
          Delete
        </Button>
      )}

      <Table
        dataSource={data?.data.data.users}
        columns={columns}
        //@ts-ignore
        rowSelection={{
          type: "checkbox",
          preserveSelectedRowKeys: true,
          ...rowSelection,
        }}
        pagination={tableParams.pagination}
        loading={loading}
        rowKey="_id"
        onChange={handleTableChange}
        className="pt-8"
      />
      {isViewUser && (
        <ModalViewUser
          isViewUser={isViewUser}
          setIsViewUser={setIsViewUser}
          dataView={dataView}
        />
      )}
      {isUpdateUser && (
        <ModalUpdateUser
          isUpdateUser={isUpdateUser}
          setIsUpdateUser={setIsUpdateUser}
          dataView={dataView}
        />
      )}
      {isModalAddUser && (
        <ModalAddUser
          isModalAddUser={isModalAddUser}
          setIsModalAddUser={setIsModalAddUser}
        />
      )}
    </>
  );
};

export default UserTable;
