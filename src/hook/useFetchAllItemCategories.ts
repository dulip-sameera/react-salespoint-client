import { useEffect, useState } from "react";
import { IItemCategoryResponse } from "../types/ResponseTypes";
import { useAuth } from "../providers/AuthProvider";
import axios, { AxiosError } from "axios";
import { ITEM_CATEGORIES_BASE_URL } from "../constants/requestUrls";

const useFetchAllItemCategories = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AxiosError>();
  const [itemCategories, setItemCategories] = useState<
    IItemCategoryResponse[] | null
  >(null);

  const { token } = useAuth();

  useEffect(() => {
    setLoading(true);

    if (!token) {
      return;
    }

    axios
      .get<IItemCategoryResponse[]>(ITEM_CATEGORIES_BASE_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const data = response.data;

        setItemCategories(data);
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

  return { loading, itemCategories, error };
};

export default useFetchAllItemCategories;
