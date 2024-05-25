import { createContext } from "react";
import { IAuthResponse } from "../types/ResponseTypes";

const AuthContext = createContext({
    isAuthenticated: false,
    token: "",
    login: (data:IAuthResponse) => {},
    logout: () => {},
});

export default AuthContext;