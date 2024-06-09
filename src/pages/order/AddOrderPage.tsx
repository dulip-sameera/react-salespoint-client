import { Box, Button, Container, Divider, Typography } from "@mui/material";
import TopBar from "../../components/TopBar";
import { useNavigate } from "react-router-dom";
import { UI_PATH_ORDER } from "../../constants/paths";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IOrderResponse } from "../../types/ResponseTypes";

import { useState } from "react";
import OrderItemAddForm from "../../components/OrderItemAddForm";
import OrderDetails from "../../components/OrderDetails";
import CreateOrderForm from "../../components/CreateOrderForm";

import OrderedItemsTable from "../../components/OrderedItemTable";

import OrderPaymentSection from "../../components/OrderPaymentSection";

const AddOrderPage = () => {
  const [order, setOrder] = useState<IOrderResponse | null>(null);

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
        {/* create order */}

        {!order && <CreateOrderForm setOrder={setOrder} />}

        {order && <OrderDetails order={order} />}

        {order && <OrderItemAddForm order={order} setOrder={setOrder} />}

        {order && <OrderedItemsTable order={order} setOrder={setOrder} />}

        {order && <OrderPaymentSection order={order} />}
      </Box>
    </Container>
  );
};

export { AddOrderPage };
