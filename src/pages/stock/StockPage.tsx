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
import {
  STOCK_DETAIL_TABLE_HEADERS,
  STOCK_TABLE_HEADERS,
} from "../../constants/enum/tableHeaders";
import { toast } from "react-toastify";
import { useUserDetails } from "../../providers/UserProvider";
import { RoleEnum } from "../../constants/enum/RoleEnum";
import { IItemResponse } from "../../types/ResponseTypes";
import axios, { HttpStatusCode } from "axios";
import { useAuth } from "../../providers/AuthProvider";
import { ITEMS_BASE_URL } from "../../constants/request-urls";
import { Link, useNavigate } from "react-router-dom";
import {
  UI_PATH_ADD_STOCK,
  UI_PATH_HOME,
  UI_PATH_MORE_STOCK,
} from "../../constants/paths";
import RefreshIcon from "@mui/icons-material/Refresh";
import useFetchAllItems from "../../hook/useFetchAllItems";
import isUserHavePermission from "../../utils/checkRoleIncludes";
import { Status } from "../../constants/enum/status";

const tableHeaders = Object.values(STOCK_TABLE_HEADERS);

const StockPage = () => {
  const [searchText, setSearchText] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [tableData, setTableData] = useState<IItemResponse[] | null>(null);
  const { loading, items, error } = useFetchAllItems();
  const { user } = useUserDetails();
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !error) {
      setTableData(items);
    }

    if (!loading && error) {
      toast.error(error.message);
      console.log(error);
    }
  }, [loading, error, items]);

  const handleSearch = () => {
    fetchItem(searchText);
  };

  useEffect(() => {
    axios
      .get<IItemResponse[]>(ITEMS_BASE_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setTableData(response.data));
    setSearchText("");
  }, [refresh]);

  const fetchItem = (itemName: string) => {
    axios
      .get<IItemResponse>(`${ITEMS_BASE_URL}/find/${itemName}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
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
            Stock Management
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
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
              }}
            >
              <TextField
                id="search-text"
                label="Item Name"
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
              >
                Search
              </Button>

              <Button
                variant="contained"
                color="success"
                startIcon={<RefreshIcon />}
                onClick={() => setRefresh((prev) => !prev)}
                sx={{ flexGrow: 1 }}
              >
                Refresh
              </Button>
            </Box>

            <Box
              display={"flex"}
              flexDirection={{ xs: "column", sm: "row" }}
              gap={2}
            >
              {user &&
                isUserHavePermission(user.role, [
                  RoleEnum.SUPER_ADMIN,
                  RoleEnum.ADMIN,
                  RoleEnum.MANAGER,
                  RoleEnum.CLERK,
                ]) && (
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => navigate(UI_PATH_ADD_STOCK)}
                  >
                    Add Stock
                  </Button>
                )}
            </Box>
          </Box>
        </Box>

        {/* data table section */}

        <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="order data table">
            <TableHead>
              <TableRow>
                {tableHeaders.map((tableHeader) => {
                  if (
                    tableHeader === "ACTIONS" &&
                    user &&
                    !isUserHavePermission(user.role, [
                      RoleEnum.SUPER_ADMIN,
                      RoleEnum.ADMIN,
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
                tableData?.map((tableDataItem) =>
                  tableDataItem.status !== Status.DELETE ? (
                    <TableRow
                      key={tableDataItem.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>{tableDataItem.id}</TableCell>
                      <TableCell>{tableDataItem.name}</TableCell>
                      <TableCell>{tableDataItem.qty}</TableCell>
                      <TableCell>{tableDataItem.category}</TableCell>
                      {user &&
                        isUserHavePermission(user.role, [
                          RoleEnum.SUPER_ADMIN,
                          RoleEnum.ADMIN,
                          RoleEnum.MANAGER,
                          RoleEnum.CLERK,
                        ]) && (
                          <TableCell>
                            <Link
                              to={`${UI_PATH_MORE_STOCK}/${tableDataItem.id}`}
                            >
                              <Button variant="contained" color="warning">
                                More
                              </Button>
                            </Link>
                          </TableCell>
                        )}
                    </TableRow>
                  ) : (
                    <></>
                  )
                )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default StockPage;
