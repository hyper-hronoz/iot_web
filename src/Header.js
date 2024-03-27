import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Button, // Import Button component
} from "@mui/material";
import MenuIcon from "@mui/icons-material/MenuOutlined";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

function Header({ onMenuItemClick }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleMenuOpen = () => {
    setIsMenuOpen(true);
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  const handleMenuItemClick = (item) => {
    onMenuItemClick(item);
    handleMenuClose();
    Cookies.set('selectedMenuItem', item);
    navigate('/chart');
  };

  const handleAuthorization = () => {
    if (Cookies.get("username")) {
      Cookies.remove("username");
      Cookies.remove("email");
      navigate('/'); // Redirect to login page
    } else {
      navigate('/auth/login'); // Redirect to login page
    }
  };

  const handelLogoClick = () => {
    navigate('/'); // Redirect to login page
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={handleMenuOpen}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          open={isMenuOpen}
          onClose={handleMenuClose}
          PaperProps={{
            style: {
              color: "#fff",
              height: "100vh",
              backgroundColor: "#1976d2",
            },
          }}
        >
          <MenuItem onClick={() => handleMenuItemClick("Temperature")}>Temperature</MenuItem>
          <MenuItem onClick={() => handleMenuItemClick("Humidity")}>Humidity</MenuItem>
          <MenuItem onClick={() => handleMenuItemClick("Coming soon...")}>Coming soon...</MenuItem>
        </Menu>


        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} onClick={handelLogoClick} style={{cursor: "pointer"}}>
          IoT Project
        </Typography>

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Welcome to your dashboard {Cookies.get("username")}
        </Typography>
        <a color="inherit" href="http://localhost:8000/admin_login.php" style={{color: "#fff", textDecoration: "none"}} rel="noreferrer" target="_blank">
          <Button color="inherit">
            Admin Panel
          </Button>
        </a>
        <Button color="inherit" onClick={handleAuthorization}>
          {Cookies.get("username") ? "Logout" : "Login"}
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Header;

