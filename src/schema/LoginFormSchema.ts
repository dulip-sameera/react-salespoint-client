import * as yup from "yup";

export const ValidationSchema = yup.object({
    username: yup
      .string()
      .min(3, "Minimum 3 characters required")
      .required("Username is required"),
    password: yup
      .string()
      .min(8, "Minimum 8 characters required")
      .required("Password is required"),
  });