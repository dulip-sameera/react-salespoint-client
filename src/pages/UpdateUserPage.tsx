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
import TopBar from "../components/TopBar";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import { UI_PATH_USER } from "../constants/paths";
import { useUserDetails } from "../providers/UserProvider";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../providers/AuthProvider";
import { toast } from "react-toastify";
import { RoleEnum } from "../constants/enum/RoleEnum";
import { useFormik } from "formik";
import { IUserUpdateFormField } from "../types/FormFieldTypes";
import { IUserResponse } from "../types/ResponseTypes";
import { PUT_UPDATE_USER_URL } from "../constants/requestUrls";
import useFetchUserById from "../hook/useFetchUserById";
import { UpdateUserSchema } from "../schema/UpdateUserSchema";

const UpdateUserPage = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { user } = useUserDetails();
  const [userRoles, setUserRoles] = useState<string[]>();
  const [userStatus, setUserStatus] = useState<string[]>();
  const [updatingUser, setUpdatingUser] = useState<IUserResponse>({
    id: 0,
    fullName: "",
    role: "",
    username: "",
    status: "",
    isAccountNonExpired: true,
    isAccountNonLocked: true,
    isCredentialsNonExpired: true,
    isEnable: true,
  });
  const { id } = useParams();
  const { loading, fetchedUser, error } = useFetchUserById(Number(id));

  useEffect(() => {
    axios
      .get<string[]>("http://localhost:8080/users/roles", {
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

    axios
      .get<string[]>("http://localhost:8080/users/statuses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setUserStatus(response.data))
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          console.log(error);
          toast.error(error.message);
        }
      });
  }, []);

  useEffect(() => {
    if (!loading && !error && fetchedUser) {
      console.log(fetchedUser);

      setUpdatingUser({
        ...fetchedUser,
      });
    }
  }, [error, loading, fetchedUser, updatingUser]);

  const handleSubmit = (values: IUserUpdateFormField) => {
    const data = {
      id: id,
      fullName: values.name,
      username: values.username,
      password: values.password === "" ? null : values.password,
      role: values.role,
      status: values.status,
    };
    axios
      .put<IUserResponse>(`${PUT_UPDATE_USER_URL}/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          navigate(UI_PATH_USER);
          toast.success("User Updated");
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
      name: updatingUser.fullName,
      username: updatingUser.username,
      password: "",
      role: updatingUser.role,
      status: updatingUser.status,
    },
    validationSchema: UpdateUserSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
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
                <FormControl fullWidth>
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    labelId="status-label"
                    id="status"
                    label="Status"
                    name="status"
                    value={formik.values.status}
                    onChange={formik.handleChange}
                  >
                    {userStatus?.map((status) => (
                      <MenuItem value={status}>{status}</MenuItem>
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

export default UpdateUserPage;
