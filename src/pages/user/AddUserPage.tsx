import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import TopBar from "../../components/TopBar";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { UI_PATH_USER } from "../../constants/paths";
import { useUserDetails } from "../../providers/UserProvider";
import { useEffect, useState } from "react";
import axios, { HttpStatusCode } from "axios";
import { useAuth } from "../../providers/AuthProvider";
import { toast } from "react-toastify";
import { RoleEnum } from "../../constants/enum/roles";
import { useFormik } from "formik";
import { AddUserSchema } from "../../schema/AddUserSchema";
import { IUserAddFormField } from "../../types/FormFieldTypes";
import { IUserResponse } from "../../types/ResponseTypes";
import { USERS_BASE_URL } from "../../constants/request-urls";

const AddUserPage = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { user } = useUserDetails();
  const [userRoles, setUserRoles] = useState<string[]>();

  useEffect(() => {
    axios
      .get<string[]>(USERS_BASE_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setUserRoles(response.data))
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          console.log(error);
          toast.error(error.message);
        }
      });
  }, []);

  const handleSubmit = (values: IUserAddFormField) => {
    const data = {
      fullName: values.name,
      username: values.username,
      password: values.password,
      role: values.role,
    };
    axios
      .post<IUserResponse>(USERS_BASE_URL, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === HttpStatusCode.Created) {
          navigate(UI_PATH_USER);
          toast.success("User Added");
        }
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

  const formik = useFormik({
    initialValues: {
      name: "",
      username: "",
      password: "",
      role: RoleEnum.CASHIER,
    },
    validationSchema: AddUserSchema,
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
            onClick={() => navigate(UI_PATH_USER)}
          >
            Back
          </Button>

          <Typography variant="h3" textAlign={"center"} color={"s"}>
            Add User
          </Typography>

          <Box mt={5}>
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
                <TextField
                  fullWidth
                  variant="outlined"
                  id="name"
                  name="name"
                  label="Full Name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Grid>
              <Grid item width={"100%"}>
                <TextField
                  fullWidth
                  variant="outlined"
                  id="username"
                  name="username"
                  label="Username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.username && Boolean(formik.errors.username)
                  }
                  helperText={formik.touched.username && formik.errors.username}
                />
              </Grid>

              <Grid item width={"100%"}>
                <TextField
                  fullWidth
                  variant="outlined"
                  id="password"
                  name="password"
                  label="Password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
                />
              </Grid>
              <Grid item width={"100%"}>
                <FormControl fullWidth>
                  <InputLabel id="role-label">Role</InputLabel>
                  <Select
                    labelId="role-label"
                    id="role"
                    label="Role"
                    name="role"
                    value={formik.values.role}
                    onChange={formik.handleChange}
                  >
                    {user?.role === RoleEnum.SUPER_ADMIN &&
                      userRoles
                        ?.filter((role) =>
                          role == RoleEnum.SUPER_ADMIN ? false : true
                        )
                        .map((role) => (
                          <MenuItem value={role}>{role}</MenuItem>
                        ))}

                    {user?.role === RoleEnum.ADMIN &&
                      userRoles
                        ?.filter((role) =>
                          role === RoleEnum.SUPER_ADMIN ||
                          role === RoleEnum.ADMIN
                            ? false
                            : true
                        )
                        .map((role) => (
                          <MenuItem value={role}>{role}</MenuItem>
                        ))}
                  </Select>
                </FormControl>
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
                  Add User
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export { AddUserPage };
