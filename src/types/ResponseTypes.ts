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

export interface IOrderResponse {
  id: number;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
  orderPaid: boolean;
  customer: ICustomerEntityResponse;
  orderItems: IOrderedItem[];
  createdBy: IUserEntity;
}

export interface ICustomerEntityResponse {
  id: number;
  fullName: string;
  phone: string;
  status: ICustomerStatusEntityResponse;
}

export interface ICustomerStatusEntityResponse {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderedItem {
  id: number;
  qty: number;
  item: IItemEntity;
}

export interface IItemEntity {
  id: number;
  name: string;
  unitPrice: number;
  qty: number;
  createdAt: Date;
  updatedAt: Date;
  itemCategory: IItemCategoryEntity;
  status: IItemStatusEntity;
}

export interface IItemCategoryEntity {
  id: number;
  name: string;
}

export interface IItemStatusEntity {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserEntity {
  id: number;
  fullName: string;
  username: string;
  status: IUserStatusEntity;
  role: IRoleEntity;
  isAccountNonExpired: boolean;
  isAccountNonLocked: boolean;
  isCredentialsNonExpired: boolean;
  isEnable: boolean;
}

export interface IUserStatusEntity {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRoleEntity {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
