import * as yup from "yup";

export const UpdateItemSchema = yup.object({
  name: yup
    .string()
    .min(3, "Minimum 3 characters required")
    .required("Item Name is required"),
  price: yup
    .number()
    .min(0.0, "Unit price should be greater than Rs.0.00")
    .required("Unit price is required"),
  category: yup.string().required("Category is required"),
  status: yup.string().required("Category is required"),
});
