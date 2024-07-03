import React, { ButtonHTMLAttributes } from "react";
import type { PopconfirmProps } from "antd";
import { message, Popconfirm } from "antd";
import { Trash2 } from "lucide-react";
import { IUser } from "@/types/users.type";
import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@/api/user.api";

interface DeleteButton extends ButtonHTMLAttributes<HTMLButtonElement> {
  dataView: IUser | null;
}

const confirm: PopconfirmProps["onConfirm"] = (e) => {
  console.log(e);
  message.success("Click on Yes");
};

const cancel: PopconfirmProps["onCancel"] = (e) => {
  return;
};

const DeleteUser = ({ dataView }: DeleteButton) => {
  const queryClient = useQueryClient();

  const handleDeleteUserMutation = useMutation({
    mutationFn: () => {
      return userApi.deleteUser(dataView?._id as any);
    },
    onSuccess: (data) => {
      message.success(data.data.message);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const onConfirm = () => {
    handleDeleteUserMutation.mutate(dataView?._id as any);
  };
  return (
    <div>
      <Popconfirm
        title="Delete user"
        description="Are you sure to delete this user?"
        onConfirm={onConfirm}
        onCancel={cancel}
        okText="Yes"
        cancelText="No"
      >
        <Trash2 className="cursor-pointer" />
      </Popconfirm>
    </div>
  );
};

export default DeleteUser;
