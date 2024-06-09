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
import TopBar from "../../components/TopBar";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import { CUSTOMER_TABLE_HEADERS } from "../../constants/enum/tableHeaders";
import useFetchAllCustomers from "../../hook/useFetchAllCustomers";
import { toast } from "react-toastify";
import { CustomerStatus } from "../../constants/enum/CustomerStatus";
import { useUserDetails } from "../../providers/UserProvider";
import { RoleEnum } from "../../constants/enum/RoleEnum";
import isUserHavePermission from "../../utils/checkRoleIncludes";
import { ICustomerResponse } from "../../types/ResponseTypes";
import axios, { HttpStatusCode } from "axios";
import { useAuth } from "../../providers/AuthProvider";
import { CUSTOMERS_BASE_URL } from "../../constants/request-urls";
import { Link, useNavigate } from "react-router-dom";
import { UI_PATH_UPDATE_CUSTOMER, UI_PATH_HOME } from "../../constants/paths";
import RefreshIcon from "@mui/icons-material/Refresh";

const tableHeaders = Object.values(CUSTOMER_TABLE_HEADERS);

const CustomerPage = () => {
  const [searchText, setSearchText] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [tableData, setTableData] = useState<ICustomerResponse[] | null>(null);
  const { loading, customers, error } = useFetchAllCustomers();
  const { user } = useUserDetails();
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !error) {
      setTableData(customers);
    }

    if (!loading && error) {
      toast.error(error.message);
      console.log(error);
    }
  }, [loading, error, customers]);

  const handleSearch = () => {
    fetchCustomer(searchText);
  };

  useEffect(() => {
    axios
      .get<ICustomerResponse[]>(CUSTOMERS_BASE_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setTableData(response.data));
    setSearchText("");
  }, [refresh]);

  const fetchCustomer = (phone: string) => {
    axios
      .get<ICustomerResponse>(`${CUSTOMERS_BASE_URL}/phone/${phone}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setTableData([response.data]);
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

  const handleDelete = (id: number) => {
    axios
      .delete<string>(`${CUSTOMERS_BASE_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status == 204) {
          toast.success(response.data);
          setRefresh((prev) => !prev);
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
            Customer Management
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
                label="Phone No"
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
              onClick={() => navigate("/customer/add")}
            >
              Add Customer
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
                    <TableCell>{tableDataItem.phone}</TableCell>
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
                            to={`${UI_PATH_UPDATE_CUSTOMER}/${tableDataItem.id}`}
                          >
                            <Button variant="contained" color="warning">
                              Update
                            </Button>
                          </Link>
                          {user &&
                          isUserHavePermission(user.role, [
                            RoleEnum.ADMIN,
                            RoleEnum.CLERK,
                            RoleEnum.MANAGER,
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

export default CustomerPage;
