import { Dispatch, FC, SetStateAction } from "react";
import { ICustomerResponse, IOrderResponse } from "../types/ResponseTypes";
import * as yup from "yup";
import useFetchAllCustomers from "../hook/useFetchAllCustomers";
import { useUserDetails } from "../providers/UserProvider";
import { useAuth } from "../providers/AuthProvider";
import axios, { HttpStatusCode } from "axios";
import { ORDERS_BASE_URL } from "../constants/request-urls";
import { toast } from "react-toastify";
import { FormikConfig, useFormik } from "formik";
import { Autocomplete, Box, Button, Grid, TextField } from "@mui/material";

interface IOrderCustomerFormType {
  customer: ICustomerResponse | null;
}

const customerFormValidateSchema = yup.object({
  customer: yup.object().required("Customer is required"),
});

interface CreateOrderProps {
  setOrder: Dispatch<SetStateAction<IOrderResponse | null>>;
}

const CreateOrderForm: FC<CreateOrderProps> = ({ setOrder }) => {
  const { loading: loadingCustomers, customers } = useFetchAllCustomers();

  const { user } = useUserDetails();

  const { token } = useAuth();

  const handleCustomerFormSubmit = (values: IOrderCustomerFormType) => {
    const data = {
      customerId: values.customer?.id,
      userId: user?.id,
    };

    axios
      .post(ORDERS_BASE_URL, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setOrder(response.data);
        toast.success("Order Created");
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

  const customerFormConfig: FormikConfig<IOrderCustomerFormType> = {
    initialValues: { customer: null },
    validationSchema: customerFormValidateSchema,
    onSubmit: handleCustomerFormSubmit,
  };

  const formik = useFormik<IOrderCustomerFormType>(customerFormConfig);

  return (
    <>
      {!loadingCustomers && customers && (
        <Box mt={4}>
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
                id="customer"
                options={customers}
                getOptionLabel={(option) => option.phone}
                onOpen={formik.handleBlur}
                onChange={(event, value) => {
                  formik.setFieldValue("customer", value);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    name="customer"
                    label="Customer Phone"
                    error={
                      formik.touched.customer && Boolean(formik.errors.customer)
                    }
                    helperText={
                      formik.touched.customer && formik.errors.customer
                    }
                  />
                )}
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
                Create Order
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}
    </>
  );
};

export default CreateOrderForm;
