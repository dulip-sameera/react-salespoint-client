import { Box, Button, Container, Divider, Typography } from "@mui/material";
import TopBar from "../components/TopBar";
import { useNavigate, useParams } from "react-router-dom";
import { UI_PATH_ORDER } from "../constants/paths";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IOrderResponse } from "../types/ResponseTypes";

import { useEffect, useState } from "react";
import OrderItemAddForm from "../components/OrderItemAddForn";
import OrderDetails from "../components/OrderDetails";
import CreateOrderForm from "../components/CreateOrderForm";

import OrderedItemsTable from "../components/OrderedItemTable";

import OrderPaymentSection from "../components/OrderPaymentSection";
import useFetchOrderById from "../hook/useFetchOrderById";
import { toast } from "react-toastify";
import axios, { HttpStatusCode } from "axios";

const OrderDetailsPage = () => {
  const [order, setOrder] = useState<IOrderResponse | null>(null);

  const { id } = useParams();

  const { loading, order: fetchedOrder, error } = useFetchOrderById(Number(id));

  useEffect(() => {
    if (!loading) {
      if (error && axios.isAxiosError(error)) {
        console.log(error);
        if (error.status == HttpStatusCode.InternalServerError) {
          toast.error(error.response?.data.detail);
        } else {
          toast.error(error.response?.data.description);
        }
      } else {
        setOrder(fetchedOrder);
      }
    }
  }, [loading, fetchedOrder, error]);

  const navigate = useNavigate();

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
            onClick={() => navigate(UI_PATH_ORDER)}
          >
            Back
          </Button>

          <Typography variant="h4" sx={{ fontSize: { xs: 26, sm: 34 } }}>
            {order ? `Order ID: ${order.id}` : "Create Order"}
          </Typography>

          <Divider sx={{ backgroundColor: "#CFFC86" }} />
        </Box>

        {order && <OrderDetails order={order} />}

        {order && !order.orderPaid && (
          <OrderItemAddForm order={order} setOrder={setOrder} />
        )}

        {order && <OrderedItemsTable order={order} setOrder={setOrder} />}

        {order && !order.orderPaid && <OrderPaymentSection order={order} />}
      </Box>
    </Container>
  );
};

export default OrderDetailsPage;
