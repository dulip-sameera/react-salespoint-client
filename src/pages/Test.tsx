import React from "react";
import { useAuth } from "../providers/AuthProvider";

type Props = {};

const Test = (props: Props) => {
  const { token, isAuthenticated } = useAuth();

  return (
    <>
      <div>{token}</div>
      <div>{isAuthenticated ? "true" : "false"}</div>
    </>
  );
};

export default Test;
