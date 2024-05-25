import React from "react";
import { useAuth } from "../providers/AuthProvider";
import { Container } from "@mui/material";
import TopBar from "../components/TopBar";
import { useUserDetails } from "../providers/UserProvider";

type Props = {};

const Test = (props: Props) => {
  const { token, isAuthenticated } = useAuth();

  const { user } = useUserDetails();

  return (
    <Container>
      <TopBar />
      <div>{token}</div>
      <div>{isAuthenticated ? "true" : "false"}</div>
      <div>{JSON.stringify(user)}</div>
    </Container>
  );
};

export default Test;
