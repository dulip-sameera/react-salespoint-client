import { Box, Button, Container, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import TopBar from "../components/TopBar";
import {
  UI_PATH_CUSTOMER,
  UI_PATH_ITEM,
  UI_PATH_ORDER,
  UI_PATH_STOCK,
  UI_PATH_USER,
} from "../constants/paths";
import RoleAccess from "../utils/RoleAccess";
import { RoleEnum } from "../constants/enum/RoleEnum";

const btnStyle = {
  width: "100%",
  paddingY: 3,
};

const linkStyle = {
  width: "100%",
};

const HomePage = () => {
  return (
    <Container>
      <TopBar />

      {/* -------------- start of the body -------------- */}
      <Box
        display={"flex"}
        flexDirection={"column"}
        gap={5}
        justifyContent={"center"}
        alignItems={"center"}
        my={15}
      >
        <RoleAccess
          role={[
            RoleEnum.ADMIN,
            RoleEnum.CASHIER,
            RoleEnum.CLERK,
            RoleEnum.MANAGER,
            RoleEnum.SUPER_ADMIN,
          ]}
        >
          <Link to={UI_PATH_ORDER} style={linkStyle}>
            <Button variant="contained" color="success" sx={btnStyle}>
              <Typography variant="h6">Order Management</Typography>
            </Button>
          </Link>

          <Link to={UI_PATH_STOCK} style={linkStyle}>
            <Button variant="contained" color="success" sx={btnStyle}>
              <Typography variant="h6">Stock Management</Typography>
            </Button>
          </Link>

          <Link to={UI_PATH_ITEM} style={linkStyle}>
            <Button variant="contained" color="success" sx={btnStyle}>
              <Typography variant="h6">Item Management</Typography>
            </Button>
          </Link>

          <Link to={UI_PATH_CUSTOMER} style={linkStyle}>
            <Button variant="contained" color="success" sx={btnStyle}>
              <Typography variant="h6">Customer Management</Typography>
            </Button>
          </Link>
        </RoleAccess>

        <RoleAccess
          role={[RoleEnum.ADMIN, RoleEnum.MANAGER, RoleEnum.SUPER_ADMIN]}
        >
          <Link to={UI_PATH_USER} style={linkStyle}>
            <Button variant="contained" color="success" sx={btnStyle}>
              <Typography variant="h6">User Management</Typography>
            </Button>
          </Link>
        </RoleAccess>
      </Box>
    </Container>
  );
};

export default HomePage;
