import { useEffect, useState } from "react";
import { IOrderResponse } from "../types/ResponseTypes";
import { useAuth } from "../providers/AuthProvider";
import axios, { AxiosError } from "axios";
import { GET_ALL_ORDERS_URL } from "../constants/requestUrls";

const useFetchAllOrders = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AxiosError>();
  const [orders, setOrders] = useState<IOrderResponse[] | null>(null);

  const { token } = useAuth();

  const loadOrders = () => {
    setLoading(true);

    if (!token) {
      return;
    }

    axios
      .get<IOrderResponse[]>(GET_ALL_ORDERS_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const data = response.data;

        setOrders(data);
      })
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          console.log(error);
          setError(error);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return { loading, orders, loadOrders, error };
};

export default useFetchAllOrders;
