import { FC, ReactNode } from "react";
import { useUserDetails } from "../providers/UserProvider";

interface Props {
  children: ReactNode;
  role: string[];
}

const RoleAccess: FC<Props> = ({ children, role }) => {
  const { user } = useUserDetails();

  if (user && role.includes(user.role)) {
    return <>{children}</>;
  } else {
    return <></>;
  }
};

export default RoleAccess;
