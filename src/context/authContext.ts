import { createContext } from "react";
import { ILoginResponse } from "../types/ResponseTypes";

const AuthContext = createContext({
    isAuthenticated: false,
    token: "",
    login: (data:ILoginResponse) => {},
    logout: () => {},
});

export default AuthContext;