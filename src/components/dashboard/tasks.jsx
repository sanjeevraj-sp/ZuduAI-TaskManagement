import {
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Button,
  Box,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { persistStore } from "redux-persist";
import { store } from "../../redux/store";
import { logout } from "../../redux/slices/authSlice"; // Make sure you have this action

const dummyTasks = [
  { id: 1, title: "Design homepage", status: "In Progress" },
  { id: 2, title: "Fix login bug", status: "Completed" },
  { id: 3, title: "Write unit tests", status: "Pending" },
];

const Tasks = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout()); // Clear auth state
    persistStore(store).purge(); // Clear persisted store
    navigate("/login");
  };

  return (
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
        <Button variant="outlined" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
      <Paper elevation={3} sx={{ p: 2 }}>
        <List>
          {dummyTasks.map((task) => (
            <ListItem key={task.id} divider>
              <ListItemText
                primary={task.title}
                secondary={`Status: ${task.status}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default Tasks;
