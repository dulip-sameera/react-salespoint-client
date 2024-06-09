import { Dispatch, FC, SetStateAction } from "react";
import { IOrderResponse } from "../types/ResponseTypes";
import { useAuth } from "../providers/AuthProvider";
import axios, { HttpStatusCode } from "axios";
import { ORDERS_BASE_URL } from "../constants/request-urls";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { ORDERED_ITEM_TABLE_HEADERS } from "../constants/enum/tableHeaders";

const tableHeaders = Object.values(ORDERED_ITEM_TABLE_HEADERS);

interface IOrderedItemsTableProps {
  setOrder: Dispatch<SetStateAction<IOrderResponse | null>>;
  order: IOrderResponse | null;
}

const OrderedItemsTable: FC<IOrderedItemsTableProps> = ({
  order,
  setOrder,
}) => {
  const { token } = useAuth();

  const handleRemoveBtn = (itemId: number) => {
    const data = {
      itemId: itemId,
      orderId: order?.id,
    };
    axios
      .post<IOrderResponse>(`${ORDERS_BASE_URL}/remove-item`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setOrder(response.data);
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
    <>
      {order && (
        <Box mt={4}>
          <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="order data table">
              <TableHead>
                <TableRow>
                  {tableHeaders.map((tableHeader) => {
                    if (tableHeader === "ACTIONS" && order.orderPaid) {
                      return <></>;
                    }
                    return <TableCell>{tableHeader}</TableCell>;
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {order.orderItems?.map((tableDataItem) => (
                  <TableRow
                    key={tableDataItem.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>{tableDataItem.id}</TableCell>
                    <TableCell>{tableDataItem.item.name}</TableCell>
                    <TableCell>{tableDataItem.item.unitPrice}</TableCell>
                    <TableCell>{tableDataItem.qty}</TableCell>
                    {!order.orderPaid && (
                      <TableCell>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleRemoveBtn(tableDataItem.item.id)}
                        >
                          Remove
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </>
  );
};

export default OrderedItemsTable;
