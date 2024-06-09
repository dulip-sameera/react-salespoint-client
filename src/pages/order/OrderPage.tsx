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
import { ORDER_TABLE_HEADERS } from "../../constants/enum/tableHeaders";
import { toast } from "react-toastify";
import { useUserDetails } from "../../providers/UserProvider";
import { RoleEnum } from "../../constants/enum/RoleEnum";
import isUserHavePermission from "../../utils/checkRoleIncludes";
import { IOrderResponse } from "../../types/ResponseTypes";
import axios, { HttpStatusCode } from "axios";
import { useAuth } from "../../providers/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import {
  UI_PATH_CREATE_ORDER,
  UI_PATH_HOME,
  UI_PATH_UPDATE_ORDER,
} from "../../constants/paths";
import RefreshIcon from "@mui/icons-material/Refresh";
import useFetchAllOrders from "../../hook/useFetchAllOrders";
import { getDateAndTime } from "../../utils/getDateAndTime";
import { ORDERS_BASE_URL } from "../../constants/requestUrls";

const tableHeaders = Object.values(ORDER_TABLE_HEADERS);

const OrderPage = () => {
  const [searchText, setSearchText] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [tableData, setTableData] = useState<IOrderResponse[] | null>(null);
  const { loading, orders, loadOrders, error } = useFetchAllOrders();
  const { user } = useUserDetails();
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !error) {
      setTableData(orders);
    }

    if (!loading && error) {
      toast.error(error.message);
      console.log(error);
    }
  }, [loading, error, orders]);

  const handleSearch = () => {
    fetchOrder(searchText);
  };

  useEffect(() => {
    loadOrders();
  }, [refresh]);

  const fetchOrder = (orderId: string) => {
    axios
      .get<IOrderResponse>(`${ORDERS_BASE_URL}/${orderId}`, {
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
      .delete<string>(`${ORDERS_BASE_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status == HttpStatusCode.NoContent) {
          toast.success("Order Deleted");
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
            Order Management
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
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              <TextField
                id="search-text"
                label="Order Id"
                variant="outlined"
                size="small"
                value={searchText}
                sx={{
                  flexGrow: 1,
                }}
                onChange={(event) => setSearchText(event.target.value)}
              />
              <Button
                variant="contained"
                color="success"
                startIcon={<SearchIcon />}
                onClick={handleSearch}
                sx={{
                  flexGrow: 1,
                }}
              >
                Search
              </Button>

              <Button
                variant="contained"
                color="success"
                startIcon={<RefreshIcon />}
                onClick={() => {
                  setRefresh((prev) => !prev);
                  setSearchText("");
                }}
                sx={{
                  flexGrow: 1,
                }}
              >
                Refresh
              </Button>
            </Box>

            <Button
              variant="contained"
              color="success"
              onClick={() => navigate(UI_PATH_CREATE_ORDER)}
            >
              Add Order
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
                    <TableCell>{tableDataItem.totalPrice}</TableCell>
                    <TableCell>
                      {getDateAndTime(tableDataItem.createdAt)}
                    </TableCell>
                    <TableCell>
                      {getDateAndTime(tableDataItem.updatedAt)}
                    </TableCell>
                    <TableCell>
                      {tableDataItem.orderPaid ? "PAID" : "NOT PAID"}
                    </TableCell>
                    <TableCell>{tableDataItem.customer.phone}</TableCell>
                    <TableCell>{tableDataItem.createdBy.username}</TableCell>
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
                          {user &&
                          isUserHavePermission(user.role, [
                            RoleEnum.ADMIN,
                            RoleEnum.SUPER_ADMIN,
                            RoleEnum.MANAGER,
                            RoleEnum.CLERK,
                          ]) &&
                          !tableDataItem.orderPaid ? (
                            <>
                              <Link
                                to={`${UI_PATH_UPDATE_ORDER}/${tableDataItem.id}`}
                              >
                                <Button variant="contained" color="warning">
                                  Update
                                </Button>
                              </Link>
                              <Button
                                variant="contained"
                                color="error"
                                onClick={() => handleDelete(tableDataItem.id)}
                              >
                                Delete
                              </Button>
                            </>
                          ) : (
                            <>
                              <Link
                                to={`${UI_PATH_UPDATE_ORDER}/${tableDataItem.id}`}
                              >
                                <Button variant="contained" color="warning">
                                  Details
                                </Button>
                              </Link>
                            </>
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

export default OrderPage;
