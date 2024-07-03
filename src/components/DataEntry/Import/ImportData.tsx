import React, { useRef, useState } from "react";
import { Button, message } from "antd";
import * as XLSX from "xlsx";
import { IUser } from "@/types/users.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IPostUser, userApi } from "@/api/user.api";
import { omit } from "lodash";

const ImportData: React.FC = () => {
  const [data, setData] = useState<IUser[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const handleCreateManyUser = useMutation({
    mutationFn: (users: IPostUser[]) => {
      return userApi.createManyUsers(users);
    },
    onSuccess: (data) => {
      message.success("Tạo thành công nhiều user vcl!!!");
      console.log("data", data);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const binaryString = event.target?.result;
        if (typeof binaryString === "string") {
          const workbook = XLSX.read(binaryString, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const sheetData = XLSX.utils.sheet_to_json<any>(sheet);
          const dataExcel = sheetData?.map((item) =>
            omit(item, ["__rowNum__"])
          );
          if (dataExcel) {
            //@ts-ignore
            handleCreateManyUser.mutate(dataExcel);
          }
          console.log("dataExcel: ", dataExcel);
        }
      };

      reader.readAsBinaryString(file);
    }
  };

  return (
    <>
      <input type="file" onChange={handleFileUpload} hidden ref={inputRef} />
      <Button
        onClick={() => inputRef.current?.click()}
        size="middle"
        htmlType="button"
        type="primary"
        className="my-4"
      >
        Import Data
      </Button>
    </>
  );
};

export default ImportData;
