export interface ILoginResponse {
  token: string;
  expiresIn: number;
}

export interface IUserResponse {
  id: number;
  fullName: string;
  username: string;
  role: string;
  status: string;
  isAccountNonExpired: boolean;
  isAccountNonLocked: boolean;
  isCredentialsNonExpired: boolean;
  isEnable: boolean;
}

export interface IItemResponse {
  id: number;
  name: string;
  unitPrice: number;
  qty: number;
  status: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStockResponse {
  id: number;
  qty: number;
  createdAt: Date;
  updatedAt: Date;
  item: IItemResponse;
}

export interface ICustomerResponse {
  id: number;
  fullName: string;
  phone: string;
  status: string;
}

export interface IItemCategoryResponse {
  id: number;
  name: string;
}
