import { useEffect, useState } from "react";
import { IStockResponse } from "../types/ResponseTypes";
import { useAuth } from "../providers/AuthProvider";
import axios, { AxiosError } from "axios";
import { STOCKS_BASE_URL } from "../constants/request-urls";

const useFetchStockByItemId = (id: number) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AxiosError>();
  const [stocks, setStocks] = useState<IStockResponse[] | null>(null);

  const { token } = useAuth();

  useEffect(() => {
    setLoading(true);

    if (!token) {
      return;
    }

    axios
      .get<IStockResponse[]>(`${STOCKS_BASE_URL}/item/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const data = response.data;

        setStocks(data);
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
  }, []);

  return { loading, stocks, error };
};

export default useFetchStockByItemId;
