import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import "./Header.css";
<<<<<<< HEAD
import { useHistory, Link } from "react-router-dom";
import { ShoppingCart } from "@mui/icons-material";

const Header = ({
  children,
  hasHiddenAuthButtons,
  handleDialogOpen,
  isReadOnly,
}) => {
  let userName = localStorage.getItem("username");
  const history = useHistory();

  const handleChange = (redirect) => {
    if (redirect === "/" && userName !== "") {
      localStorage.clear();
      history.push(redirect);
      window.location.reload();
    } else history.push(redirect);
  };
  return (
    <Box className="header">
      <Box className="header-title">
        <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>
      {children}
      {userName ? (
        <Stack direction="row" spacing={2} alignItems="center">
          {!isReadOnly ? (
            <Button onClick={handleDialogOpen}>
              <ShoppingCart />
            </Button>
          ) : (
            <></>
          )}
          <Avatar alt={userName} src="avatar.png" />
          <p className="username-text">{userName}</p>
          <Button
            className="button"
            variant="contained"
            onClick={() => handleChange("/")}
          >
            Logout
          </Button>
        </Stack>
      ) : (
        <Stack direction="row" spacing={2} alignItems="center">
          <Button onClick={() => handleChange("/login")}>Login</Button>
          <Button
            className="button"
            variant="contained"
            onClick={() => handleChange("/register")}
          >
            Register
          </Button>
        </Stack>
      )}
    </Box>
  );
=======

const Header = ({ children, hasHiddenAuthButtons }) => {
    return (
      <Box className="header">
        <Box className="header-title">
            <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>
        <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
        >
          Back to explore
        </Button>
      </Box>
    );
>>>>>>> origin/master
};

export default Header;
