import React from "react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { Button } from "antd";
import { IUser } from "@/types/users.type";
import { omit } from "lodash";

type Props = {
  data: IUser[];
  fileName: string;
};
const ExportData = ({ data, fileName }: Props) => {
  const dataExcel =
    Array.isArray(data) && data?.map((item) => omit(item, ["__v","_id"]));
  const exportToExcel = () => {
    //@ts-ignore
    const worksheet = XLSX.utils.json_to_sheet(dataExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    }); //create a buffer
    //Buffer là vùng lưu trữ dữ liệu tạm thời và thường được lưu trữ trong bộ nhớ tạm (RAM) 
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" }); //create blob from buffer
    saveAs(blob, `${fileName}.xlsx`); //save file
  };
  return (
    <>
      <Button
        onClick={exportToExcel}
        size="middle"
        htmlType="button"
        type="primary"
        className="my-4"
      >
        Export to Excel
      </Button>
    </>
  );
};

export default ExportData;
