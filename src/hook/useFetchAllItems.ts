import { useEffect, useState } from "react";
import { IItemResponse } from "../types/ResponseTypes";
import { useAuth } from "../providers/AuthProvider";
import axios, { AxiosError } from "axios";
import { GET_ALL_ITEMS_URL } from "../constants/requestUrls";

const useFetchAllItems = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AxiosError>();
  const [items, setItems] = useState<IItemResponse[] | null>(null);

  const { token } = useAuth();

  useEffect(() => {
    setLoading(true);

    if (!token) {
      return;
    }

    axios
      .get<IItemResponse[]>(GET_ALL_ITEMS_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const data = response.data;

        setItems(data);
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

  return { loading, items, error };
};

export default useFetchAllItems;
