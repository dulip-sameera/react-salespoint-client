import {
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import TopBar from "../components/TopBar";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import { ITEM_CATEGORY_TABLE_HEADERS } from "../constants/enum/tableHeaders";
import { toast } from "react-toastify";
import { useUserDetails } from "../providers/UserProvider";
import { RoleEnum } from "../constants/enum/RoleEnum";
import isUserHavePermission from "../utils/checkRoleIncludes";
import { IItemCategoryResponse } from "../types/ResponseTypes";
import axios, { HttpStatusCode } from "axios";
import { useAuth } from "../providers/AuthProvider";
import {
  DELETE_ITEM_CATEGORY_URL,
  GET_ALL_ITEM_CATEGORIES_URL,
  GET_ITEM_CATEGORy_BY_NAME_URL,
  POST_CREATE_ITEM_CATEGORIES_URL,
  PUT_UPDATE_ITEM_CATEGORIES_URL,
} from "../constants/requestUrls";
import { useNavigate } from "react-router-dom";
import { UI_PATH_ITEM } from "../constants/paths";
import RefreshIcon from "@mui/icons-material/Refresh";
import useFetchAllItemCategories from "../hook/useFetchAllItemCategories";
import { FormikHelpers, FormikState, useFormik } from "formik";
import * as yup from "yup";

const tableHeaders = Object.values(ITEM_CATEGORY_TABLE_HEADERS);

const ItemCategoryPage = () => {
  const [searchText, setSearchText] = useState("");
  const [refreshState, setRefreshState] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatedItem, setUpdatedItem] = useState<{ name: string; id: number }>({
    name: "",
    id: 0,
  });
  const [tableData, setTableData] = useState<IItemCategoryResponse[] | null>(
    null
  );
  const { loading, itemCategories, error } = useFetchAllItemCategories();
  const { user } = useUserDetails();
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !error) {
      setTableData(itemCategories);
    }

    if (!loading && error) {
      toast.error(error.message);
      console.log(error);
    }
  }, [loading, error, itemCategories]);

  const handleSearch = () => {
    fetchItemCategory(searchText);
  };

  useEffect(() => {
    axios
      .get<IItemCategoryResponse[]>(GET_ALL_ITEM_CATEGORIES_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setTableData(response.data));
    setSearchText("");
  }, [refreshState]);

  const refresh = () => setRefreshState((prev) => !prev);

  const handleAddItemCategory = (
    values: { name: string },
    resetForm: (
      nextState?: Partial<FormikState<{ name: string }>> | undefined
    ) => void
  ) => {
    axios
      .post<IItemCategoryResponse>(
        POST_CREATE_ITEM_CATEGORIES_URL,
        { name: values.name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        toast.success(`Item Category Created ${response.data.name}`);
        refresh();
        resetForm();
      })
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          console.log(error);
          if (error.status === HttpStatusCode.InternalServerError) {
            toast.error(error.response?.data.detail);
          } else {
            toast.error(error.response?.data.description);
          }
        }
      });
  };

  const handleUpdateItemCategory = (
    values: { name: string },
    resetForm: (
      nextState?: Partial<FormikState<{ name: string }>> | undefined
    ) => void
  ) => {
    axios
      .put<IItemCategoryResponse>(
        `${PUT_UPDATE_ITEM_CATEGORIES_URL}/${updatedItem.id}`,
        { name: values.name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        toast.success(`Item Category Updated ${response.data.name}`);
        refresh();
        resetForm();
        setIsUpdating(false);
      })
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          console.log(error);
          if (error.status === HttpStatusCode.InternalServerError) {
            toast.error(error.response?.data.detail);
          } else {
            toast.error(error.response?.data.description);
          }
        }
      });
  };

  const handleSubmit = (
    values: { name: string },
    { resetForm }: FormikHelpers<{ name: string }>
  ) => {
    if (isUpdating) {
      handleUpdateItemCategory(values, resetForm);
    } else {
      handleAddItemCategory(values, resetForm);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: isUpdating ? updatedItem.name : "",
    },
    validationSchema: yup.object({
      name: yup
        .string()
        .min(3, "Minimum 3 characters required")
        .required("Item name required"),
    }),
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  const fetchItemCategory = (itemCategoryName: string) => {
    axios
      .get<IItemCategoryResponse>(
        `${GET_ITEM_CATEGORy_BY_NAME_URL}/find/${itemCategoryName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => setTableData([response.data]))
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

  const handleDelete = (id: number) => {
    axios
      .delete<string>(`${DELETE_ITEM_CATEGORY_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status == HttpStatusCode.NoContent) {
          toast.success("Item Category Deleted");
          setRefreshState((prev) => !prev);
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

  return (
    <Container>
      <TopBar />
      <Box
        sx={{
          my: 15,
        }}
      >
        {/* page title section */}
        <Box>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            color="success"
            sx={{
              mb: 4,
            }}
            onClick={() => navigate(UI_PATH_ITEM)}
          >
            Back
          </Button>

          <Typography variant="h4" sx={{ fontSize: { xs: 26, sm: 34 } }}>
            Item Category Management
          </Typography>

          <Divider sx={{ backgroundColor: "#CFFC86" }} />

          {/* Action section */}
          <Box
            sx={{
              my: 4,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Box
              sx={{
                gap: 2,
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <TextField
                id="search-text"
                label="Item Category Name"
                variant="outlined"
                size="small"
                value={searchText}
                sx={{
                  flexGrow: { xs: 1, sm: 2 },
                }}
                onChange={(event) => setSearchText(event.target.value)}
              />
              <Button
                variant="contained"
                color="success"
                startIcon={<SearchIcon />}
                onClick={handleSearch}
                sx={{ flexGrow: 1 }}
              >
                Search
              </Button>

              <Button
                variant="contained"
                color="success"
                startIcon={<RefreshIcon />}
                onClick={() => setRefreshState((prev) => !prev)}
                sx={{
                  flexGrow: 1,
                }}
              >
                Refresh
              </Button>
            </Box>

            {user &&
              isUserHavePermission(user.role, [
                RoleEnum.SUPER_ADMIN,
                RoleEnum.ADMIN,
                RoleEnum.MANAGER,
                RoleEnum.CLERK,
              ]) && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 2,
                  }}
                  component={"form"}
                  onSubmit={formik.handleSubmit}
                >
                  <TextField
                    id="name"
                    name="name"
                    label="Item Category Name"
                    variant="outlined"
                    size="small"
                    value={formik.values.name}
                    sx={{
                      flexGrow: 1,
                    }}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                  />
                  {!isUpdating ? (
                    <Button variant="contained" color="success" type={"submit"}>
                      Add Item Category
                    </Button>
                  ) : (
                    <Box display={"flex"} gap={2}>
                      <Button
                        variant="contained"
                        color="warning"
                        type={"submit"}
                        sx={{
                          flexGrow: 1,
                        }}
                      >
                        Update
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => setIsUpdating(false)}
                        sx={{
                          flexGrow: 1,
                        }}
                      >
                        Cancel
                      </Button>
                    </Box>
                  )}
                </Box>
              )}
          </Box>
        </Box>

        {/* data table section */}

        <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="order data table">
            <TableHead>
              <TableRow>
                {user &&
                  tableHeaders.map((tableHeader) => {
                    if (
                      tableHeader === "ACTIONS" &&
                      !isUserHavePermission(user.role, [
                        RoleEnum.ADMIN,
                        RoleEnum.SUPER_ADMIN,
                        RoleEnum.MANAGER,
                        RoleEnum.CLERK,
                      ])
                    ) {
                      return <></>;
                    }
                    return <TableCell>{tableHeader}</TableCell>;
                  })}
              </TableRow>
            </TableHead>
            <TableBody>
              {!loading &&
                !error &&
                tableData?.map((tableDataItem) => (
                  <TableRow
                    key={tableDataItem.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>{tableDataItem.id}</TableCell>
                    <TableCell>{tableDataItem.name}</TableCell>

                    {user &&
                      isUserHavePermission(user.role, [
                        RoleEnum.ADMIN,
                        RoleEnum.SUPER_ADMIN,
                        RoleEnum.MANAGER,
                        RoleEnum.CLERK,
                      ]) && (
                        <TableCell>
                          {isUpdating && updatedItem.id === tableDataItem.id ? (
                            <></>
                          ) : (
                            <Box
                              sx={{
                                display: "flex",
                                flexGrow: 1,
                                gap: 1,
                                flexDirection: { xs: "column", sm: "row" },
                              }}
                            >
                              <Button
                                variant="contained"
                                color="warning"
                                onClick={() => {
                                  setIsUpdating(true);
                                  setUpdatedItem({
                                    name: tableDataItem.name,
                                    id: tableDataItem.id,
                                  });
                                }}
                              >
                                Update
                              </Button>

                              <Button
                                variant="contained"
                                color="error"
                                onClick={() => handleDelete(tableDataItem.id)}
                              >
                                Delete
                              </Button>
                            </Box>
                          )}
                        </TableCell>
                      )}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default ItemCategoryPage;
