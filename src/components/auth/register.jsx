import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  Alert,
} from "@mui/material";

import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/slices/authSlice";
import { validateFormByType } from "../../utils/formValidation";
import { FORM_TYPES } from "../../constants/forms/formTypes";
import  http  from "../../services/httpServices";
import ErrorBoundary from "../../utils/fallBackUI";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "confirmPassword") {
      setConfirmPassword(value);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value || "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setErrors({});

    // Dynamic password match check
    if (formData.password !== confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    try {
      // Validate other fields
      const validationErrors = await validateFormByType(
        FORM_TYPES.REGISTER,
        formData
      );
      if (validationErrors) {
        setErrors(validationErrors);
        return;
      }

      // Register user
      const res = await http.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      const data = res.data;

      // Auto-login and redirect
      dispatch(
        loginSuccess({
          token: data.token,
          user: data.user,
        })
      );
      navigate("/dashboard");
    } catch (err) {
      setApiError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <ErrorBoundary>
      <Box sx={{ maxWidth: 400, mx: "auto", mt: 8 }}>
        <Typography variant="h4" gutterBottom>
          Register
        </Typography>

        {apiError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {apiError}
          </Alert>
        )}

        <Stack spacing={2}>
          <TextField
            label="User Name"
            name="name"
            fullWidth
            variant="outlined"
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
          />

          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            variant="outlined"
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
          />

          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            variant="outlined"
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
          />

          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            fullWidth
            variant="outlined"
            onChange={handleChange}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            fullWidth
          >
            Register
          </Button>

          <Typography
            variant="body2"
            sx={{
              textAlign: "center",
              mt: 1,
              cursor: "pointer",
              color: "primary.main",
            }}
            onClick={() => navigate("/login")}
          >
            Already have an account? Login
          </Typography>
        </Stack>
      </Box>
    </ErrorBoundary>
  );
};

export default Register;