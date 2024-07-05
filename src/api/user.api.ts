import axios from "@/utils/axios";
import { url } from "@/constant/url";
import { SuccessResponse } from "@/types/auth.type";
import { IUser, IUserListConfig, UserList } from "@/types/users.type";
import { IUpdateUser } from "@/components/Modal/ModalUpdateUser/ModalUpdateUser";
export type IPostUser = Pick<IUser, "name" | "address" | "phone" | "email">;

export type ISearchUser = {
  [key in keyof IPostUser]: string;
};

export const userApi = {
  getAllUsers() {
    return axios.get<SuccessResponse<IUser>>(url.users);
  },
  queryUser(params?: IUserListConfig) {
    return axios.get<SuccessResponse<UserList>>(url.users, {
      params,
    });
  },
  createUser(body: IPostUser) {
    return axios.post<SuccessResponse<IUser>>(url.users, body);
  },
  createManyUsers(users: IPostUser[]) {
    return axios.post<SuccessResponse<IUser>>(`${url.users}/bulk`, {
      users,
    });
  },
  updateUser(id: string, body: IUpdateUser) {
    return axios.patch<SuccessResponse<IUpdateUser>>(
      `${url.users}/${id}`,
      body
    );
  },
  deleteUser(_id: string) {
    return axios.delete<SuccessResponse<IUser>>(`${url.users}/${_id}`);
  },
  deleteManyUser(userId: string[]) {
    return axios.delete<SuccessResponse<IUser>>(`${url.users}`, {
      //@ts-ignore
      data: {
        userId: userId,
      },
    });
  },
};
