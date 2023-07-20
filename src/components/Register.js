import React, { useState } from "react";
import { Box } from "@mui/system";
import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import axios from "axios";
import { useSnackbar } from "notistack";
import { Link, useHistory } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";
import { config } from "../App";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  const register = async () => {
    const isValidInput = validateInput(formData);
    if (isValidInput !== true) {
      return false;
    }

    const { username, password } = formData;

    const url = config.endpoint + "/auth/register";
    setIsLoading(true);
    try {
      const response = await axios.post(url, {
        username: username,
        password: password,
      });
      console.log(response);
      setIsLoading(false);
      if (response.data.success) {
        enqueueSnackbar("Registered Successfully", {
          variant: "success",
        });
        history.push("/login");
      }
    } catch (e) {
      if (e.response) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
        setIsLoading(false);
      } else {
        // Something happened in setting up the request that triggered an Error
        enqueueSnackbar(
          "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
          { variant: "error" }
        );
      }
    }
  };

  const validateInput = (data) => {
    if (data.username === "") {
      enqueueSnackbar("Username is a required field", {
        variant: "error",
      });
      return false;
    } else if (data.username.length < 6) {
      enqueueSnackbar("Username must be at least 6 characters", {
        variant: "error",
      });
      return false;
    }
    if (data.password === "") {
      enqueueSnackbar("Password is a required field", {
        variant: "error",
      });
      return false;
    } else if (data.password.length < 6) {
      enqueueSnackbar("Password must be at least 6 characters", {
        variant: "error",
      });
      return false;
    }
    if (data.password !== data.confirmPassword) {
      enqueueSnackbar("Passwords do not match", {
        variant: "error",
      });
      return false;
    }
    return true;
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
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            value={formData.username}
            onChange={(event) =>
              setFormData({
                ...formData,
                [event.target.name]: event.target.value,
              })
            }
            fullWidth
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            helperText="Password must be at least 6 characters long"
            value={formData.password}
            onChange={(event) =>
              setFormData({
                ...formData,
                [event.target.name]: event.target.value,
              })
            }
            fullWidth
            placeholder="Enter a password with a minimum of 6 characters"
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(event) =>
              setFormData({
                ...formData,
                [event.target.name]: event.target.value,
              })
            }
            fullWidth
          />
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          ) : (
            <Button variant="contained" className="button" onClick={register}>
              Register Now
            </Button>
          )}
          <p className="secondary-action">
            Already have an account?{" "}
            <Link to="/login" className="link">
              Login here
            </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
