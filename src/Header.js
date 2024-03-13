import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
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
    onMenuItemClick(item); // Update selectedMenuItem in parent component
    handleMenuClose();
    Cookies.set('selectedMenuItem', item);
    navigate('/chart');
  };

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

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          IoT Project
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Header;

