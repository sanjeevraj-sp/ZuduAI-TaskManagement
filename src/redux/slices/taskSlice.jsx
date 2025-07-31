// src/redux/slices/taskSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tasks: {
    team: [],
    own: [],
  },
  loading: false,
  error: null,
};

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    setTasks: (state, action) => {
      state.tasks.own = action.payload.own || [];
      state.tasks.team = action.payload.team || [];
    },
    addOwnTask: (state, action) => {
      state.tasks.own.push(action.payload);
    },
    addTeamTask: (state, action) => {
      state.tasks.team.push(action.payload);
    },
    updateTask: (state, action) => {
      const { task, type } = action.payload;
      const list = state.tasks[type];
      const index = list.findIndex((t) => t.id === task.id);
      if (index !== -1) {
        list[index] = task;
      }
    },
    deleteTask: (state, action) => {
      const { taskId, type } = action.payload;
      state.tasks[type] = state.tasks[type].filter((t) => t.id !== taskId);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setTasks,
  addOwnTask,
  addTeamTask,
  updateTask,
  deleteTask,
  setLoading,
  setError,
} = taskSlice.actions;

export default taskSlice.reducer;
