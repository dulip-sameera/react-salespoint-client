import { createContext } from "react";
import { IUserResponse } from "../types/ResponseTypes";

interface IProp {
   user: IUserResponse | null;
   setUser: React.Dispatch<React.SetStateAction<IUserResponse | null>>
}

 const UserDetailsContext =  createContext<IProp>({
    user: null,
    setUser: () => {} 
 })

 export default UserDetailsContext;