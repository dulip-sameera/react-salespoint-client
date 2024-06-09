import { useEffect, useState } from "react";
import { IUserResponse } from "../../types/ResponseTypes";
import { useAuth } from "../../providers/AuthProvider";
import axios, { AxiosError } from "axios";
import { USERS_BASE_URL } from "../../constants/request-urls";

const useFetchCurrentUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AxiosError>();
  const [currentUser, setCurrentUser] = useState<IUserResponse | null>(null);

  const { token } = useAuth();

  useEffect(() => {
    setLoading(true);

    if (!token) {
      return;
    }

    axios
      .get<IUserResponse>(`${USERS_BASE_URL}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const data = response.data;

        setCurrentUser(data);
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

  return { loading, currentUser, error };
};

export default useFetchCurrentUser;
