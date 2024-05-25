import * as yup from "yup";

export const UpdateUserSchema = yup.object({
  name: yup
    .string()
    .min(3, "Minimum 3 characters required")
    .required("User Full Name is required"),
  username: yup
    .string()
    .min(3, "Minimum 3 characters required")
    .required("username is required"),
  password: yup.string().min(8, "Minimum 8 characters required"),
  role: yup.string().required("User Role is required"),
});
