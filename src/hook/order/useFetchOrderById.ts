import { useEffect, useState } from "react";
import { IOrderResponse } from "../../types/ResponseTypes";
import { useAuth } from "../../providers/AuthProvider";
import axios, { AxiosError } from "axios";
import { ORDERS_BASE_URL } from "../../constants/request-urls";

const useFetchOrderById = (id: number) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AxiosError>();
  const [order, setOrder] = useState<IOrderResponse | null>(null);

  const { token } = useAuth();

  const loadOrder = () => {
    setLoading(true);

    if (!token) {
      return;
    }

    axios
      .get<IOrderResponse>(`${ORDERS_BASE_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const data = response.data;

        setOrder(data);
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
    loadOrder();
  }, []);

  return { loading, order, loadOrder, error };
};

export { useFetchOrderById };
