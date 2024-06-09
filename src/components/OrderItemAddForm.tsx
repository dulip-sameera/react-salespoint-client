import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import {
  IItemEntity,
  IItemResponse,
  IOrderResponse,
} from "../types/ResponseTypes";
import useFetchAllItems from "../hook/useFetchAllItems";
import { useAuth } from "../providers/AuthProvider";
import * as yup from "yup";
import axios, { HttpStatusCode } from "axios";
import { ORDERS_BASE_URL } from "../constants/request-urls";
import { toast } from "react-toastify";
import { FormikConfig, FormikHelpers, useFormik } from "formik";
import {
  Autocomplete,
  Box,
  Button,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { Status } from "../constants/enum/status";

interface IOrderItemAddFormProps {
  setOrder: Dispatch<SetStateAction<IOrderResponse | null>>;
  order: IOrderResponse | null;
}

interface IOrderItemAddFormType {
  item: IItemEntity | null;
  qty: number;
}

const orderItemAddFormValidationSchema = yup.object({
  item: yup.object().required("Item is required"),
  qty: yup
    .number()
    .min(0, "Quantity should be greater than zero")
    .required("Quantity is required"),
});

const OrderItemAddForm: FC<IOrderItemAddFormProps> = ({ order, setOrder }) => {
  const [itemList, setItemList] = useState<IItemResponse[]>();

  const { loading, items, error } = useFetchAllItems();

  useEffect(() => {
    if (!loading && items) {
      const ar = items?.filter((item) => item.status !== Status.DELETE);
      setItemList(ar);
    }

    if (!loading && error) {
      if (axios.isAxiosError(error)) {
        console.log(error);
        if (error.status == HttpStatusCode.InternalServerError) {
          toast.error(error.response?.data.detail);
        } else {
          toast.error(error.response?.data.description);
        }
      }
    }
  }, [loading, error, items]);

  const { token } = useAuth();

  const handleOrderItemAddFormSubmit = (
    values: IOrderItemAddFormType,
    { resetForm }: FormikHelpers<IOrderItemAddFormType>
  ) => {
    const data = {
      orderId: order?.id,
      itemId: values.item?.id,
      qty: values.qty,
    };

    axios
      .post(`${ORDERS_BASE_URL}/add-item`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setOrder(response.data);
        toast.success("Item Added");
        resetForm();
      })
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          console.log(error);
          if (error.status == HttpStatusCode.InternalServerError) {
            toast.error(error.response?.data.detail);
          } else {
            toast.error(error.response?.data.description);
          }
        }
      });
  };

  const orderItemAddFormConfig: FormikConfig<IOrderItemAddFormType> = {
    initialValues: {
      item: null,
      qty: 0,
    },
    validationSchema: orderItemAddFormValidationSchema,
    onSubmit: handleOrderItemAddFormSubmit,
  };

  const formik = useFormik<IOrderItemAddFormType>(orderItemAddFormConfig);

  return (
    <>
      {order && !loading && !error && itemList && (
        <Box my={4}>
          <Typography variant="h4" sx={{ fontSize: { xs: 26, sm: 34 } }}>
            Add Items
          </Typography>

          <Box>
            <Grid
              container
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                flexGrow: 1,
              }}
              spacing={4}
              component={"form"}
              onSubmit={formik.handleSubmit}
            >
              <Grid item width={"100%"}>
                <Autocomplete
                  disablePortal
                  id="item"
                  options={itemList}
                  getOptionLabel={(option) => `${option.name} (${option.qty})`}
                  onOpen={formik.handleBlur}
                  onChange={(event, value) => {
                    formik.setFieldValue("item", value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name="item"
                      label="Item"
                      error={formik.touched.item && Boolean(formik.errors.item)}
                      helperText={formik.touched.item && formik.errors.item}
                    />
                  )}
                />
              </Grid>
              <Grid item width={"100%"}>
                <TextField
                  fullWidth
                  variant="outlined"
                  id="qty"
                  name="qty"
                  label="Quantity"
                  value={formik.values.qty}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.qty && Boolean(formik.errors.qty)}
                  helperText={formik.touched.qty && formik.errors.qty}
                />
              </Grid>
              <Grid item width={"100%"}>
                <Button
                  variant="contained"
                  color="success"
                  size="large"
                  type="submit"
                  sx={{
                    py: 2,
                  }}
                  fullWidth
                >
                  Add Item
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      )}
    </>
  );
};

export default OrderItemAddForm;
