import * as yup from "yup";

export const AddCustomerSchema = yup.object({
    name: yup
      .string()
      .min(3, "Minimum 3 characters required")
      .required("Customer Name is required"),
      phone: yup
      .string()
      .min(8, "Minimum 8 characters required")
      .matches(/^[0]{1}[7]{1}[01245678]{1}[0-9]{7}$/, "Invalid Sri Lankan phone number")
      .required("Password is required"),
  });