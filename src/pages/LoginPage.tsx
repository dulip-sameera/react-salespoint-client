import { Box, Button, Grid, Paper, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { ValidationSchema } from "../schema/LoginFormSchema";
import { ILoginFormField } from "../types/FormFieldTypes";
import axios from "axios";
import { ILoginResponse } from "../types/ResponseTypes";
import { AUTH_LOGIN_URL } from "../constants/request-urls";
import { toast } from "react-toastify";
import { useAuth } from "../providers/AuthProvider";
import { useNavigate } from "react-router-dom";
import { UI_PATH_HOME } from "../constants/paths";

const LoginPage = () => {
  const { login } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (values: ILoginFormField) => {
    const data: ILoginFormField = {
      username: values.username,
      password: values.password,
    };

    try {
      const response = await axios.post<ILoginResponse>(AUTH_LOGIN_URL, data);

      const authData: ILoginResponse = {
        token: response.data.token,
        expiresIn: response.data.expiresIn,
      };

      login(authData);

      navigate(UI_PATH_HOME);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error);
        toast.error(error.response?.data.detail, { theme: "colored" });
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: ValidationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      minHeight={"100vh"}
    >
      <Paper elevation={0}>
        <Grid
          container
          direction="column"
          spacing={3}
          justifyContent={"center"}
          alignItems={"center"}
          component={"form"}
          onSubmit={formik.handleSubmit}
        >
          <Grid item xs={3}>
            <Typography
              variant="h1"
              fontSize={45}
              sx={{
                //   fontSize: 64,
                color: "#27AE60",
              }}
            >
              Sales{"{Point}"}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <TextField
              id="username"
              name="username"
              label="Username"
              variant="outlined"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.username && Boolean(formik.errors.username)}
              helperText={formik.touched.username && formik.errors.username}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              id="password"
              name="password"
              label="Password"
              type="password"
              variant="outlined"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
          </Grid>
          <Grid item xs={3}>
            <Button variant="contained" color="success" type="submit">
              Log In
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default LoginPage;
