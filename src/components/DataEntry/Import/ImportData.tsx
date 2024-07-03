import React, { RefAttributes, useRef, useState } from "react";
import { Button } from "antd";
import * as XLSX from "xlsx";
import { IUser } from "@/types/users.type";

const ImportData: React.FC = () => {
  const [data, setData] = useState<IUser[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
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

          setData(sheetData);
          console.log("data: ", data);
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
      {/* https://medium.com/@gb.usmanumar/how-to-import-data-from-excel-xlsx-in-react-js-f486a600dc9f */}
    </>
  );
};

export default ImportData;
