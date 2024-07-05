export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone: number | string;
  address: string;
  status: boolean;
  age: number;
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
  sortBy?: string;
  sortOrder?: string;
  gt?: number;
  lt?: number;
  status?: "0" | "1";
}

export interface UserList {
  users: IUser[];
  pagination: {
    page: number;
    limit: number;
    total?: number;
  };
}
