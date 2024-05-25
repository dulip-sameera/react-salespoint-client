import { FC, ReactNode, useContext, useState } from "react";
import { IUserResponse } from "../types/ResponseTypes";
import UserDetailsContext from "../context/userDetailsContext";

interface Props {
  children: ReactNode;
}

export const UserProvider: FC<Props> = ({ children }) => {
  const [user, setUser] = useState<IUserResponse | null>(null);

  return (
    <UserDetailsContext.Provider value={{ user, setUser }}>
      {children}
    </UserDetailsContext.Provider>
  );
};

export const useUserDetails = () => {
  return useContext(UserDetailsContext);
};
