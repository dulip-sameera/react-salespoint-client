import { useEffect, useState } from "react"
import { IUserResponse } from "../types/ResponseTypes"
import { useAuth } from "../providers/AuthProvider"
import axios, { AxiosError } from "axios"
import { GET_CURRENT_USER_URL } from "../constants/requestUrls"

const useFetchCurrentUser = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<AxiosError>()
    const [currentUser, setCurrentUser] = useState<IUserResponse | null>(null)

    const {token} = useAuth();

    useEffect(() => {

        setLoading(true);

        if (!token) {
            return;
          }
      
          axios
            .get<IUserResponse>(GET_CURRENT_USER_URL, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((response) => {
              const data = response.data;
      
              const currentLoggedInUser: IUserResponse = {
                id: data.id,
                fullName: data.fullName,
                username: data.username,
                role: data.role,
                status: data.status,
                isAccountNonLocked: data.isAccountNonExpired,
                isAccountNonExpired: data.isAccountNonExpired,
                isCredentialsNonExpired: data.isCredentialsNonExpired,
                isEnable: data.isEnable,
              };
      
              setCurrentUser(currentLoggedInUser);
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

    return {loading, currentUser, error};
}

export default useFetchCurrentUser;