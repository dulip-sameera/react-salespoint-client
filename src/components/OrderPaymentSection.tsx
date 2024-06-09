import { Box, Button } from "@mui/material";
import { IOrderResponse } from "../types/ResponseTypes";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import axios, { HttpStatusCode } from "axios";
import { ORDERS_BASE_URL } from "../constants/requestUrls";
import { UI_PATH_ORDER } from "../constants/paths";
import { toast } from "react-toastify";

type Props = {
  order: IOrderResponse | null;
};

const OrderPaymentSection = ({ order }: Props) => {
  const { token } = useAuth();

  const navigate = useNavigate();

  const handleOrderCancel = () => {
    axios
      .delete(`${ORDERS_BASE_URL}/${order?.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        toast.success("Order Canceled");
        navigate(UI_PATH_ORDER);
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

  const handleOrderPayment = () => {
    const data = {
      orderId: order?.id,
      paidStatus: true,
    };
    axios
      .put<IOrderResponse>(`${ORDERS_BASE_URL}/pay`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((reponse) => {
        toast.success("Order has been paid");
        navigate(UI_PATH_ORDER);
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
        <Box mt={4} display={"flex"} gap={2}>
          <Button
            variant="contained"
            color="error"
            size="large"
            sx={{ flexGrow: 1 }}
            onClick={handleOrderCancel}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            color="success"
            size="large"
            sx={{ flexGrow: 1 }}
            onClick={handleOrderPayment}
          >
            Pay
          </Button>
        </Box>
      )}
    </>
  );
};

export default OrderPaymentSection;
