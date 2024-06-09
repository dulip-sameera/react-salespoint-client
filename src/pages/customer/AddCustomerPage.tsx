import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import TopBar from "../../components/TopBar";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { UI_PATH_CUSTOMER } from "../../constants/paths";
import { useFormik } from "formik";
import { AddCustomerSchema } from "../../schema/AddCustomerSchema";
import { ICustomerAddFormField } from "../../types/FormFieldTypes";
import axios from "axios";
import { useAuth } from "../../providers/AuthProvider";
import { ICustomerResponse } from "../../types/ResponseTypes";
import { toast } from "react-toastify";
import { CUSTOMERS_BASE_URL } from "../../constants/request-urls";

const AddCustomerPage = () => {
  const navigate = useNavigate();

  const { token } = useAuth();

  const handleSubmit = (values: ICustomerAddFormField) => {
    const data = {
      fullName: values.name,
      phone: values.phone,
    };
    axios
      .post<ICustomerResponse>(CUSTOMERS_BASE_URL, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 201) {
          navigate(UI_PATH_CUSTOMER);
          toast.success("Customer Added");
        }
      })
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          console.log(error);
          if (error.status == 500) {
            toast.error(error.response?.data.detail);
          } else {
            toast.error(error.response?.data.description);
          }
        }
      });
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      phone: "",
    },
    validationSchema: AddCustomerSchema,
    onSubmit: handleSubmit,
  });

  return (
    <Container>
      <TopBar />
      <Box
        sx={{
          my: 15,
        }}
      >
        <Box>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            color="success"
            sx={{
              mb: 4,
            }}
            onClick={() => navigate(UI_PATH_CUSTOMER)}
          >
            Back
          </Button>

          <Typography variant="h3" textAlign={"center"} color={"s"}>
            Add Customer
          </Typography>
          <Box mt={5}>
            <Grid
              container
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
              }}
              spacing={4}
              component={"form"}
              onSubmit={formik.handleSubmit}
            >
              <Grid item>
                <TextField
                  variant="outlined"
                  id="name"
                  name="name"
                  label="Customer Name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Grid>
              <Grid item>
                <TextField
                  variant="outlined"
                  id="phone"
                  name="phone"
                  label="Customer Phone"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.phone && Boolean(formik.errors.phone)}
                  helperText={formik.touched.name && formik.errors.phone}
                />
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="success"
                  size="large"
                  type="submit"
                >
                  Add Customer
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export { AddCustomerPage };
