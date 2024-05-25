import { useEffect, useState } from "react";
import { IUserResponse } from "../types/ResponseTypes";
import { useAuth } from "../providers/AuthProvider";
import axios, { AxiosError } from "axios";
import { GET_USER_URL } from "../constants/requestUrls";

const useFetchUserById = (id: number) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AxiosError>();
  const [fetchedUser, setFetchedUser] = useState<IUserResponse | null>(null);

  const { token } = useAuth();

  useEffect(() => {
    setLoading(true);

    if (!token) {
      return;
    }

    axios
      .get<IUserResponse>(`${GET_USER_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const data = response.data;

        setFetchedUser(data);
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

  return { loading, fetchedUser, error };
};

export default useFetchUserById;
