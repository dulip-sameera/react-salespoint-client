import { useEffect, useState } from "react";
import { IItemResponse } from "../../types/ResponseTypes";
import { useAuth } from "../../providers/AuthProvider";
import axios, { AxiosError } from "axios";
import { ITEMS_BASE_URL } from "../../constants/request-urls";

const useFetchAllItems = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AxiosError<any>>();
  const [items, setItems] = useState<IItemResponse[] | null>(null);

  const { token } = useAuth();

  useEffect(() => {
    setLoading(true);

    if (!token) {
      return;
    }

    axios
      .get<IItemResponse[]>(ITEMS_BASE_URL, {
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

export { useFetchAllItems };
