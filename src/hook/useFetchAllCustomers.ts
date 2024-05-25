import { useEffect, useState } from "react"
import { ICustomerResponse } from "../types/ResponseTypes"
import { useAuth } from "../providers/AuthProvider"
import axios, { AxiosError } from "axios"
import { GET_ALL_CUSTOMERS_URL } from "../constants/requestUrls"

const useFetchAllCustomers = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<AxiosError>()
    const [customers, setCustomers] = useState<ICustomerResponse[] | null>(null)

    const {token} = useAuth();

    useEffect(() => {

        setLoading(true);

        if (!token) {
            return;
          }
      
          axios
            .get<ICustomerResponse[]>(GET_ALL_CUSTOMERS_URL, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((response) => {
              const data = response.data;
      
              setCustomers(data);
            })
            .catch((error) => {
              if (axios.isAxiosError(error)) {
                console.log(error);
                setError(error)
              }
            }).finally(() => {
                setLoading(false)
            });
    }, [])

    return {loading, customers, error};
}

export default useFetchAllCustomers;