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
import { useEffect, useState } from "react";
import { STOCK_DETAIL_TABLE_HEADERS } from "../constants/enum/tableHeaders";
import { toast } from "react-toastify";

import { IItemResponse, IStockResponse } from "../types/ResponseTypes";
import axios, { HttpStatusCode } from "axios";
import { useAuth } from "../providers/AuthProvider";
import {
  DELETE_STOCK_URL,
  GET_ALL_STOCKS_BY_ITEM_URL,
  GET_ITEM_BY_ID_URL,
  PUT_UPDATE_STOCK_URL,
} from "../constants/requestUrls";
import { useNavigate, useParams } from "react-router-dom";
import { UI_PATH_STOCK } from "../constants/paths";

import useFetchStockByItemId from "../hook/useFetchStockByItemId";
import useFetchItemById from "../hook/useFetchItemById";
import { getDateAndTime } from "../utils/getDateAndTime";
import { FormikHelpers, useFormik } from "formik";
import * as yup from "yup";

const tableHeaders = Object.values(STOCK_DETAIL_TABLE_HEADERS);

const StockDetailsPage = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [refreshState, setRefreshState] = useState(0);
  const [item, setItem] = useState<IItemResponse>();
  const [updatingStock, setUpdatingStock] = useState<IStockResponse>({
    id: 0,
    qty: 0,
    item: {
      category: "",
      createdAt: new Date(),
      id: 0,
      name: "",
      qty: 0,
      status: "",
      unitPrice: 0,
      updatedAt: new Date(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const [tableData, setTableData] = useState<IStockResponse[] | null>(null);
  const { id } = useParams();
  const { loading, stocks, error } = useFetchStockByItemId(Number(id));
  const { loading: itemLoading, item: fetchingItem } = useFetchItemById(
    Number(id)
  );
  const { token } = useAuth();
  const navigate = useNavigate();

  const refresh = () => setRefreshState((prev) => prev + 1);

  useEffect(() => {
    if (!loading && !error) {
      setTableData(stocks);
    }

    if (!itemLoading && fetchingItem) {
      setItem(fetchingItem);
    }

    if (!loading && error) {
      toast.error(error.message);
      console.log(error);
    }
  }, [loading, error, stocks, fetchingItem, itemLoading]);

  useEffect(() => {
    axios
      .get(`${GET_ALL_STOCKS_BY_ITEM_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setTableData(response.data));

    axios
      .get(`${GET_ITEM_BY_ID_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setItem(response.data));
  }, [refreshState]);

  const handleUpdateStock = (
    values: { qty: number },
    { resetForm }: FormikHelpers<{ qty: number }>
  ) => {
    const data = {
      id: updatingStock?.id,
      qty: values.qty,
      itemId: id,
    };

    axios
      .put(`${PUT_UPDATE_STOCK_URL}/${updatingStock?.id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((reponse) => {
        toast.success("Stock Updated");
        setIsUpdating(false);
        resetForm();
        refresh();
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
      .delete(`${DELETE_STOCK_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        toast.success("Stock Deleted");
        refresh();
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
      qty: updatingStock?.qty,
    },
    validationSchema: yup.object({
      qty: yup
        .number()
        .min(0, "Quantity should be greater than zero")
        .required("Quantity is required"),
    }),
    onSubmit: handleUpdateStock,
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
        {/* page title section */}
        <Box>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            color="success"
            sx={{
              mb: 4,
            }}
            onClick={() => navigate(UI_PATH_STOCK)}
          >
            Back
          </Button>

          <Typography variant="h4" sx={{ fontSize: { xs: 26, sm: 34 } }}>
            Stock Details
          </Typography>

          <Divider sx={{ backgroundColor: "#CFFC86" }} />

          <Box my={4}>
            <Box display={"flex"} gap={3}>
              <Typography
                sx={{
                  fontSize: 25,
                  fontWeight: "bold",
                }}
              >
                Item :
              </Typography>
              <Typography
                sx={{
                  fontSize: 25,
                  fontWeight: "bold",
                }}
              >
                {!itemLoading && item && item.name}
              </Typography>
            </Box>
            <Box display={"flex"} gap={3}>
              <Typography
                sx={{
                  fontSize: 25,
                  fontWeight: "bold",
                }}
              >
                Quantity :
              </Typography>
              <Typography
                sx={{
                  fontSize: 25,
                  fontWeight: "bold",
                }}
              >
                {!itemLoading && item && item.qty}
              </Typography>
            </Box>
          </Box>

          {/* Action section */}

          {isUpdating && (
            <Box
              sx={{
                my: 4,
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
              }}
              component={"form"}
              onSubmit={formik.handleSubmit}
            >
              <TextField
                id="qty"
                name="qty"
                label="Quantity"
                variant="outlined"
                size="small"
                value={formik.values.qty}
                sx={{
                  flexGrow: 1,
                }}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.qty && Boolean(formik.errors.qty)}
                helperText={formik.touched.qty && formik.errors.qty}
              />
              <Button
                variant="contained"
                color="warning"
                type="submit"
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
                sx={{ flexGrow: 1 }}
              >
                Cancel
              </Button>
            </Box>
          )}
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
                    <TableCell>{tableDataItem.qty}</TableCell>
                    <TableCell>
                      {getDateAndTime(tableDataItem.createdAt)}
                    </TableCell>
                    <TableCell>
                      {getDateAndTime(tableDataItem.updatedAt)}
                    </TableCell>
                    <TableCell>
                      {isUpdating && updatingStock?.id === tableDataItem.id ? (
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
                              setUpdatingStock(tableDataItem);
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
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default StockDetailsPage;
