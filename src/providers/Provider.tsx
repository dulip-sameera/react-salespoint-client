import { FC, ReactNode } from "react";
import { CookiesProvider } from "react-cookie";
import { AuthProvider } from "./AuthProvider";

interface Props {
  children: ReactNode;
}

const Provider: FC<Props> = ({ children }) => {
  return (
    <>
      <AuthProvider>
        <CookiesProvider defaultSetOptions={{ path: "/" }}>
          {children}
        </CookiesProvider>
      </AuthProvider>
    </>
  );
};

export default Provider;
