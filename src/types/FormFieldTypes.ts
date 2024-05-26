export interface ILoginFormField {
  username: string;
  password: string;
}

export interface ICustomerAddFormField {
  name: string;
  phone: string;
}

export interface IUserAddFormField {
  name: string;
  username: string;
  password: string;
  role: string;
}

export interface IUserUpdateFormField {
  name: string;
  username: string;
  password: string;
  role: string;
  status: string;
}

export interface IItemCategoryFormField {
  name: string;
}

export interface IItemAddFormField {
  name: string;
  price: number;
  category: string;
}

export interface IItemUpdateFormField {
  name: string;
  price: number;
  category: string;
  status: string;
}
