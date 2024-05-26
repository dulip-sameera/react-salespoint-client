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
import { USER_TABLE_HEADERS } from "../constants/enum/tableHeaders";
import { toast } from "react-toastify";
import { CustomerStatus } from "../constants/enum/CustomerStatus";
import { useUserDetails } from "../providers/UserProvider";
import { RoleEnum } from "../constants/enum/RoleEnum";
import isUserHavePermission from "../utils/checkRoleIncludes";
import { IUserResponse } from "../types/ResponseTypes";
import axios, { HttpStatusCode } from "axios";
import { useAuth } from "../providers/AuthProvider";
import { DELETE_USER_URL, GET_ALL_USERS_URL } from "../constants/requestUrls";
import { Link, useNavigate } from "react-router-dom";
import {
  UI_PATH_ADD_USER,
  UI_PATH_HOME,
  UI_PATH_UPDATE_USER,
} from "../constants/paths";
import RefreshIcon from "@mui/icons-material/Refresh";
import useFetchAllUsers from "../hook/useFetchAllUsers";

const tableHeaders = Object.values(USER_TABLE_HEADERS);

const UserPage = () => {
  const [searchText, setSearchText] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [tableData, setTableData] = useState<IUserResponse[] | null>(null);
  const { loading, users, error } = useFetchAllUsers();
  const { user } = useUserDetails();
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !error) {
      setTableData(users);
    }

    if (!loading && error) {
      toast.error(error.message);
      console.log(error);
    }
  }, [loading, error, users]);

  const handleSearch = () => {
    fetchUser(searchText);
  };

  useEffect(() => {
    axios
      .get<IUserResponse[]>(GET_ALL_USERS_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setTableData(response.data));
  }, [refresh]);

  const fetchUser = (username: string) => {
    toast.warning("Not Implemented Yet");

    // axios
    //   .get<IUserResponse>(`${GET_CUSTOMER_BY_PHONE_URL}${phone}`, {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   })
    //   .then((response) => {
    //     setTableData([response.data]);
    //   })
    //   .catch((error) => {
    //     if (axios.isAxiosError(error)) {
    //       toast.error(error.response.data.description, { theme: "colored" });
    //       console.log(error);
    //     }
    //   });
  };

  const handleDelete = (id: number) => {
    axios
      .delete<string>(`${DELETE_USER_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status == HttpStatusCode.NoContent) {
          toast.success("User Deleted");
          setRefresh((prev) => !prev);
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
            onClick={() => navigate(UI_PATH_HOME)}
          >
            Back
          </Button>

          <Typography variant="h4" sx={{ fontSize: { xs: 26, sm: 34 } }}>
            User Management
          </Typography>

          <Divider sx={{ backgroundColor: "#CFFC86" }} />

          {/* Action section */}
          <Box
            sx={{
              my: 4,
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                mb: { xs: 2, sm: 0 },
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <TextField
                id="search-text"
                label="Username"
                variant="outlined"
                size="small"
                value={searchText}
                sx={{
                  mr: 3,
                  flexGrow: 1,
                }}
                onChange={(event) => setSearchText(event.target.value)}
              />
              <Button
                variant="contained"
                color="success"
                startIcon={<SearchIcon />}
                onClick={handleSearch}
              >
                Search
              </Button>

              <Button
                variant="contained"
                color="success"
                startIcon={<RefreshIcon />}
                onClick={() => setRefresh((prev) => !prev)}
                sx={{ ml: 2 }}
              >
                Refresh
              </Button>
            </Box>

            <Button
              variant="contained"
              color="success"
              onClick={() => navigate(UI_PATH_ADD_USER)}
            >
              Add User
            </Button>
          </Box>
        </Box>

        {/* data table section */}

        <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="order data table">
            <TableHead>
              <TableRow>
                {tableHeaders.map((tableHeader) => (
                  <TableCell>{tableHeader}</TableCell>
                ))}
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
                    <TableCell>{tableDataItem.fullName}</TableCell>
                    <TableCell>{tableDataItem.username}</TableCell>
                    <TableCell>{tableDataItem.role}</TableCell>
                    <TableCell>{tableDataItem.status}</TableCell>
                    <TableCell>
                      {
                        <Box
                          sx={{
                            display: "flex",
                            flexGrow: 1,
                            gap: 1,
                            flexDirection: { xs: "column", sm: "row" },
                          }}
                        >
                          <Link
                            to={`${UI_PATH_UPDATE_USER}/${tableDataItem.id}`}
                          >
                            <Button variant="contained" color="warning">
                              Update
                            </Button>
                          </Link>
                          {user &&
                          isUserHavePermission(user.role, [
                            RoleEnum.ADMIN,
                            RoleEnum.SUPER_ADMIN,
                          ]) &&
                          tableDataItem.status !== CustomerStatus.DELETE ? (
                            <Button
                              variant="contained"
                              color="error"
                              onClick={() => handleDelete(tableDataItem.id)}
                            >
                              Delete
                            </Button>
                          ) : (
                            <></>
                          )}
                        </Box>
                      }
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default UserPage;
