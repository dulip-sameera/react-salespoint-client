import { useEffect, useState } from "react";
import { IItemResponse } from "../types/ResponseTypes";
import { useAuth } from "../providers/AuthProvider";
import axios, { AxiosError } from "axios";
import { ITEMS_BASE_URL } from "../constants/requestUrls";

const useFetchItemById = (id: number) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AxiosError>();
  const [item, setItem] = useState<IItemResponse | null>(null);

  const { token } = useAuth();

  useEffect(() => {
    setLoading(true);

    if (!token) {
      return;
    }

    axios
      .get<IItemResponse>(`${ITEMS_BASE_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const data = response.data;

        setItem(data);
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

  return { loading, item, error };
};

export default useFetchItemById;
