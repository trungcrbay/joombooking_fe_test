export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone: number | string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUserListConfig {
  page?: number;
  limit?: number;
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
}

export interface UserList {
  users: IUser[];
  pagination: {
    page: number;
    limit: number;
    total?:number
  };
}
