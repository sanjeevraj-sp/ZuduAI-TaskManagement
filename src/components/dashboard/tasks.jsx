import { Container, Typography, Button, Box } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { persistStore } from "redux-persist";
import { store } from "../../redux/store";
import { logout } from "../../redux/slices/authSlice"; // Make sure you have this action
import AddTaskModal from "./addTaskModel";
import TaskBoard from "./taskBoard";

const Tasks = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout()); // Clear auth state
    persistStore(store).purge(); // Clear persisted store
    navigate("/login");
  };

  const handleClose = () => {
    setOpen(false);
  };

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
          {/* Buttons aligned right */}
          <Box display="flex" alignItems="center">
            <Button variant="contained" onClick={() => setOpen(true)}>
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
