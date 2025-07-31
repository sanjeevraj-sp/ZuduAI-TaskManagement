import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { validateFormByType } from "../../utils/formValidation";
import { FORM_TYPES } from "../../constants/forms/formTypes";
import http, { setAuthToken } from "../../services/httpServices";
import {
  addOwnTask,
  addTeamTask,
  updateTask,
} from "../../redux/slices/taskSlice";
import PropTypes from "prop-types";

const AddTaskModal = ({ open, onClose, task = null, type = "own" }) => {
  const { user, token } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    name: "",
    priority: 0,
    assignedUserIds: [],
    status: "Todo",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const dispatch = useDispatch();
  const isEditMode = !!task;

  // Populate form with task data if editing
  useEffect(() => {
    if (task) {
      setForm({
        name: task.name,
        priority: task.priority,
        assignedUserIds: task.assignedUserIds || [user.id],
        status: task.status || "Todo",
      });
    } else {
      setForm({ name: "", priority: 0, assignedUserIds: [user.id] });
    }
  }, [task]);

  useEffect(() => {
    if (user.role === "Admin") {
      setLoadingUsers(true);
      fetch("/api/users")
        .then((res) => res.json())
        .then((data) => {
          const filtered = data.filter((u) => u.id !== user.id);
          setAllUsers(filtered);
          setLoadingUsers(false);
        })
        .catch(() => {
          setAllUsers([]);
          setLoadingUsers(false);
        });
    }
  }, []);

  const handleClose = () => {
    setForm({ name: "", priority: 0, assignedUserIds: [user.id] });
    setErrors({});
    setApiError("");
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "priority" ? Number(value) : value,
    }));
  };

  const handleUsersChange = (event) => {
    let selected =
      typeof event.target.value === "string"
        ? event.target.value.split(",")
        : event.target.value;

    if (!selected.includes(user.id)) {
      selected = [...selected, user.id];
    }

    setForm((prev) => ({
      ...prev,
      assignedUserIds: selected,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setApiError("");

    try {
      const sanitizedForm = { ...form };
      delete sanitizedForm.users;

      const validationErrors = await validateFormByType(
        FORM_TYPES.TASK,
        sanitizedForm
      );
      if (validationErrors) {
        setErrors(validationErrors);
        return;
      }

      setAuthToken(token);

      if (isEditMode) {
        // Update Task
        const res = await http.put(`/task/${task.id}`, sanitizedForm);
        dispatch(updateTask({ task: res.data.task, type }));
      } else {
        // Create new task
        const payload = {
          ...form,
          createdBy: user.id,
          createdAt: new Date().toISOString(),
          status: "Todo",
        };
        const res = await http.post("/task", payload);
        const newTask = res.data;

        if (newTask.action === "addOwnTask") {
          dispatch(addOwnTask(newTask.task));
        } else {
          dispatch(addTeamTask(newTask.task));
        }
      }

      handleClose();
    } catch (err) {
      setApiError(err.response?.data?.message || "Task operation failed");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEditMode ? "Edit Task" : "Create Task"}</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Task Name"
          fullWidth
          name="name"
          value={form.name}
          onChange={handleChange}
          error={!!errors.name}
          helperText={errors.name}
        />

        {isEditMode && (
          <TextField
            margin="dense"
            label="Status"
            select
            fullWidth
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            {["Todo", "In Progress", "Completed"].map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>
        )}

        {user.role === "Admin" && (
          <FormControl fullWidth margin="normal">
            <InputLabel>Assign Users</InputLabel>
            {loadingUsers ? (
              <CircularProgress size={24} />
            ) : (
              <Select
                name="assignedUserIds"
                multiple
                value={form.assignedUserIds || []}
                onChange={handleUsersChange}
                renderValue={(selected) =>
                  allUsers
                    .filter((u) => selected.includes(u.id))
                    .map((u) => u.name || u.email)
                    .join(", ")
                }
              >
                {allUsers.map((u) => (
                  <MenuItem key={u.id} value={u.id}>
                    {u.name || u.email}
                  </MenuItem>
                ))}
              </Select>
            )}
          </FormControl>
        )}

        <TextField
          margin="dense"
          label="Priority"
          select
          fullWidth
          name="priority"
          value={form.priority}
          onChange={handleChange}
        >
          {[0, 1, 2, 3].map((p) => (
            <MenuItem key={p} value={p}>
              {p}
            </MenuItem>
          ))}
        </TextField>

        {apiError && <p style={{ color: "red" }}>{apiError}</p>}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} variant="contained">
          {isEditMode ? "Update" : "Create"}
        </Button>
        <Button onClick={handleClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

AddTaskModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  task: PropTypes.object,
  type: PropTypes.string,
};

export default AddTaskModal;
