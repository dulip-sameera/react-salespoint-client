import { FC, ReactNode, useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { ILoginResponse } from "../types/ResponseTypes";
import AuthContext from "../context/authContext";

interface Props {
  children: ReactNode;
}

export const AuthProvider: FC<Props> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string>("");
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);

  useEffect(() => {
    const savedToken = cookies.token;
    if (savedToken) {
      setIsAuthenticated(true);
      setToken(savedToken);
    }
  }, []);

  const login = (data: ILoginResponse) => {
    console.log(data);
    setCookie("token", data.token, {
      path: "/",
      maxAge: data.expiresIn / 1000,
    });
    setIsAuthenticated(true);
    setToken(data.token);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setToken("");
    removeCookie("token");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
