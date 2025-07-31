import { Container, Typography, Button, Box } from "@mui/material";
import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { persistStore } from "redux-persist";
import { store } from "../../redux/store";
import { logout } from "../../redux/slices/authSlice";
import AddTaskModal from "./addTaskModel";
import TaskBoard from "./taskBoard";

const Tasks = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = useCallback(() => {
    dispatch(logout());
    persistStore(store).purge();
    navigate("/login");
  }, [dispatch, navigate]);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  return (
    <>
      <AddTaskModal open={open} onClose={handleClose} />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Typography variant="h4" gutterBottom>
            Your Tasks
          </Typography>
          <Box display="flex" alignItems="center">
            <Button variant="contained" onClick={handleOpen}>
              Add Task
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={handleLogout}
              sx={{ ml: 2 }}
            >
              Logout
            </Button>
          </Box>
        </Box>
        <TaskBoard />
      </Container>
    </>
  );
};

export default Tasks;
