import { useState, useCallback, useMemo } from "react";
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
import http from "../../services/httpServices";
import ErrorBoundary from "../../utils/fallBackUI";

const LogIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value || "",
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        const validationErrors = await validateFormByType(
          FORM_TYPES.LOGIN,
          formData
        );
        if (validationErrors) {
          setErrors(validationErrors);
          return;
        }

        const res = await http.post("/auth/login", formData);
        const data = res.data;

        dispatch(
          loginSuccess({
            token: data.token,
            user: data.user,
          })
        );

        navigate("/dashboard");
      } catch (err) {
        setApiError(err.response?.data?.message || "Login failed");
      }
    },
    [dispatch, formData, navigate]
  );

  const emailError = useMemo(() => errors.email, [errors.email]);
  const passwordError = useMemo(() => errors.password, [errors.password]);

  return (
    <ErrorBoundary>
      <Box sx={{ maxWidth: 400, mx: "auto", mt: 8 }}>
        <Typography variant="h4" gutterBottom>
          Log In
        </Typography>

        {apiError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {apiError}
          </Alert>
        )}

        <Stack spacing={2}>
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            variant="outlined"
            onChange={handleChange}
            error={!!emailError}
            helperText={emailError}
          />

          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            variant="outlined"
            onChange={handleChange}
            error={!!passwordError}
            helperText={passwordError}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            fullWidth
          >
            Log In
          </Button>

          <Typography
            variant="body2"
            sx={{
              textAlign: "center",
              mt: 1,
              cursor: "pointer",
              color: "primary.main",
            }}
            onClick={() => navigate("/register")}
          >
            New user?
          </Typography>
        </Stack>
      </Box>
    </ErrorBoundary>
  );
};

export default LogIn;
