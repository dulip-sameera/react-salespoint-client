import { FC, ReactNode } from "react";
import { CookiesProvider } from "react-cookie";
import { AuthProvider } from "./AuthProvider";
import { UserProvider } from "./UserProvider";

interface Props {
  children: ReactNode;
}

const Provider: FC<Props> = ({ children }) => {
  return (
    <>
      <AuthProvider>
        <UserProvider>
          <CookiesProvider defaultSetOptions={{ path: "/" }}>
            {children}
          </CookiesProvider>
        </UserProvider>
      </AuthProvider>
    </>
  );
};

export default Provider;
