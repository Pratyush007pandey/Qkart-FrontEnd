import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Login.css";

const Login = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);

  const login = async () => {
    setIsLoading(true);
    let isValid = validateInput(formData);
    if (isValid) {
      const { username, password } = formData;
      try {
        let response = await axios.post(`${config.endpoint}/auth/login`, {
          username: username,
          password: password,
        });
        if (response.data.success) {
          enqueueSnackbar("Logged in successfully", {
            variant: "success",
          });
          let { token, username, balance } = response.data;
          persistLogin(token, username, balance - 0);
          history.push("/");
          return true;
        }
      } catch (e) {
        if (e.response && e.response.status === 400) {
          setIsLoading(false);
          return enqueueSnackbar(e.response.data.message, { variant: "error" });
        } else {
          enqueueSnackbar(
            "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
            { variant: "error" }
          );
          setIsLoading(false);
        }
      }
    }
  };

  const validateInput = (data) => {
    if (data.username === "") {
      enqueueSnackbar("Username is a required field", {
        variant: "error",
      });
      return false;
    }
    if (data.password === "") {
      enqueueSnackbar("Password is a required field", {
        variant: "error",
      });
      return false;
    }
    return true;
  };

  const persistLogin = (token, username, balance) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("balance", balance);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Login</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            fullWidth
            value={formData.username}
            onChange={(event) =>
              setFormData({
                ...formData,
                [event.target.name]: event.target.value,
              })
            }
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            fullWidth
            placeholder="Enter a password with a minimum of 6 characters"
            value={formData.password}
            onChange={(event) =>
              setFormData({
                ...formData,
                [event.target.name]: event.target.value,
              })
            }
          />
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          ) : (
            <Button variant="contained" className="button" onClick={login}>
              Login
            </Button>
          )}
          <p>
            Don't have an account?{" "}
            <Link to="/register" className={"link"}>
              Register Here
            </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Login;
