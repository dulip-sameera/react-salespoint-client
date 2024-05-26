import * as yup from "yup";

export const AddStockSchema = yup.object({
  qty: yup
    .number()
    .min(0, "Quantity should be greater than zero")
    .required("Quantity is required"),
  item: yup.object().shape({
    id: yup.number().required("Item is required"),
    label: yup.string().required("Item is required"),
  }),
});
