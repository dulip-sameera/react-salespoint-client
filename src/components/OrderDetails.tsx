import { FC } from "react";
import { IOrderResponse } from "../types/ResponseTypes";
import { Box, Divider, Grid, Typography } from "@mui/material";
import { getDateAndTime } from "../utils/getDateAndTime";

interface OrderDetailsProps {
  order: IOrderResponse | null;
}

const OrderDetails: FC<OrderDetailsProps> = ({ order }) => {
  return (
    <>
      {order && (
        <Box my={4}>
          <Grid container width={{ xs: "100%", sm: "35%" }}>
            <Grid item xs={6}>
              <Typography>Order ID :</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>{order.id}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography>Total :</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>{`Rs. ${order.totalPrice}`}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography>Status :</Typography>
            </Grid>
            <Grid item xs={6}>
              {order.orderPaid ? (
                <Typography color={"green"}>PAID</Typography>
              ) : (
                <Typography color={"red"}>NOT PAID</Typography>
              )}
            </Grid>

            <Grid item xs={6}>
              <Typography>Customer :</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>{`${order.customer.fullName} (${order.customer.phone})`}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography>Order Created By :</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>{`${order.createdBy.fullName} (${order.createdBy.username})`}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography>Order Created At :</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>{getDateAndTime(order.createdAt)}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography>Order Updated At :</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>{getDateAndTime(order.updatedAt)}</Typography>
            </Grid>
          </Grid>
        </Box>
      )}

      <Divider sx={{ backgroundColor: "#CFFC86" }} />
    </>
  );
};

export default OrderDetails;
