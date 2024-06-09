import {
  AppBar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useEffect, useState } from "react";
import { useUserDetails } from "../providers/UserProvider";
import { useAuth } from "../providers/AuthProvider";
import { useNavigate } from "react-router-dom";
import { UI_PATH_LOGIN } from "../constants/paths";
import { useFetchCurrentUser } from "../hook/user";

const drawerWidth = 240;

const TopBar = () => {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  const { user, setUser } = useUserDetails();

  const { logout } = useAuth();

  const navigate = useNavigate();

  const { loading, currentUser, error } = useFetchCurrentUser();

  useEffect(() => {
    if (!loading && !error) {
      setUser(currentUser);
    }

    if (!loading && error) {
      console.log(error);
    }
  }, [loading]);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleLogOut = () => {
    logout(), navigate(UI_PATH_LOGIN);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2, color: "#27AE60" }}>
        Sales{"{Point}"}
      </Typography>
      <Divider />
      <List>
        <ListItem sx={{ display: "flex", flexDirection: "column" }}>
          {!loading && (
            <>
              <Typography>{user?.role}</Typography>
              <Typography>{user?.fullName}</Typography>
              <Typography>{user?.username}</Typography>
            </>
          )}
        </ListItem>
        <ListItem
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button variant="contained" color="error" onClick={handleLogOut}>
            Log out
          </Button>
        </ListItem>
      </List>
    </Box>
  );
  return (
    <>
      <AppBar component={"nav"} sx={{ backgroundColor: "#fff" }}>
        <Toolbar>
          <IconButton
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 1.5, display: { sm: "none" }, color: "#000" }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component={"div"}
            sx={{ my: 2, color: "#27AE60", flexGrow: 1 }}
          >
            Sales{"{Point}"}
          </Typography>
          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              gap: 4,
            }}
          >
            {!loading && (
              <>
                <Typography color={"#000"}>
                  {user?.role}: {user?.fullName}({user?.username})
                </Typography>
              </>
            )}
            <Button variant="contained" color="error" onClick={handleLogOut}>
              Log Out
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default TopBar;
