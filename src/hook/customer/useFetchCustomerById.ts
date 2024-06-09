import { useEffect, useState } from "react";
import { ICustomerResponse } from "../../types/ResponseTypes";
import { useAuth } from "../../providers/AuthProvider";
import axios, { AxiosError } from "axios";
import { CUSTOMERS_BASE_URL } from "../../constants/request-urls";

const useFetchCustomersById = (id: number) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AxiosError>();
  const [customer, setCustomer] = useState<ICustomerResponse | null>(null);

  const { token } = useAuth();

  useEffect(() => {
    setLoading(true);

    if (!token) {
      return;
    }

    axios
      .get<ICustomerResponse>(`${CUSTOMERS_BASE_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const data = response.data;

        setCustomer(data);
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

  return { loading, customer, error };
};

export default useFetchCustomersById;
