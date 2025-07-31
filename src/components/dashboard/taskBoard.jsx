import { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import http, { setAuthToken } from "../../services/httpServices";
import {
  setTasks,
  setLoading,
  deleteTask,
  setError,
} from "../../redux/slices/taskSlice";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Container,
  Stack,
} from "@mui/material";
import AddTaskModal from "./addTaskModel";

const TaskBoard = () => {
  const dispatch = useDispatch();
  const { tasks, loading } = useSelector((state) => state.task);
  const { token, user } = useSelector((state) => state.auth);
  const [selectedTaskDetails, setSelectedTaskDetails] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (!token) return;
    setAuthToken(token);
    dispatch(setLoading(true));
    http
      .get("/tasks")
      .then((res) => dispatch(setTasks(res.data)))
      .catch((err) => dispatch(setError(err.message)))
      .finally(() => dispatch(setLoading(false)));
  }, [token, dispatch]);

  const handleEdit = useCallback((task) => {
    setSelectedTaskDetails(task);
    setOpenModal(true);
  }, []);

  const handleDelete = useCallback(
    async (task) => {
      if (!window.confirm(`Are you sure you want to delete "${task.name}"?`))
        return;

      try {
        setAuthToken(token);
        await http.delete(`/task/${task.id}`);

        const type = task.createdBy === user.id ? "own" : "team";
        dispatch(deleteTask({ taskId: task.id, type }));
      } catch (err) {
        alert("Failed to delete the task.");
      }
    },
    [token, user?.id, dispatch]
  );

  const renderTaskCard = useCallback(
    (task, type) => {
      const isOwn = type === "own";
      const role = user?.role;

      const canEdit =
        isOwn || (type === "team" && (role === "Manager" || role === "Admin"));
      const canDelete = isOwn || (type === "team" && role === "Admin");

      return (
        <Card key={task.id} sx={{ mb: 2, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6">{task.name}</Typography>
            <Typography variant="body2">Status: {task.status}</Typography>
            <Typography variant="body2" color="text.secondary">
              Priority: {task.priority}
            </Typography>
            <Stack direction="row" spacing={2} mt={2}>
              {canEdit && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleEdit({ task, type })}
                >
                  Edit
                </Button>
              )}
              {canDelete && (
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleDelete(task)}
                >
                  Delete
                </Button>
              )}
            </Stack>
          </CardContent>
        </Card>
      );
    },
    [handleEdit, handleDelete, user?.role]
  );

  const ownTasks = useMemo(
    () =>
      tasks?.own?.length > 0 ? (
        tasks.own.map((task) => renderTaskCard(task, "own"))
      ) : (
        <Typography color="text.secondary">No tasks created by you.</Typography>
      ),
    [tasks?.own, renderTaskCard]
  );

  const teamTasks = useMemo(
    () =>
      tasks?.team?.length > 0 ? (
        tasks.team.map((task) => renderTaskCard(task, "team"))
      ) : (
        <Typography color="text.secondary">
          No team tasks assigned to you.
        </Typography>
      ),
    [tasks?.team, renderTaskCard]
  );

  if (loading)
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
        <Typography mt={2}>Loading tasks...</Typography>
      </Box>
    );

  return (
    <>
      {openModal && selectedTaskDetails && (
        <AddTaskModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          task={selectedTaskDetails.task}
          type={selectedTaskDetails.type}
        />
      )}
      <Container maxWidth="md" sx={{ mt: 6 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Your Tasks
        </Typography>
        {ownTasks}

        <Typography variant="h5" fontWeight="bold" sx={{ mt: 6, mb: 2 }}>
          Team Tasks
        </Typography>
        {teamTasks}
      </Container>
    </>
  );
};

export default TaskBoard;
