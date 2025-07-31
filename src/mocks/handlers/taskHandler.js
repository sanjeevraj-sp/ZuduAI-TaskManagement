import { http, HttpResponse } from "msw";
import { db } from "../db";
import { getUserFromRequest } from "../utils/authUtils";
import { v4 as uuidv4 } from "uuid";

export const taskHandlers = [
  // 1. CREATE TASK
  http.post("/api/task", async ({ request }) => {
    try {
      const user = await getUserFromRequest(request);
      const {
        name,
        status,
        priority,
        assignedUserIds = [],
      } = await request.json();

      if (!name || !status || priority === undefined) {
        return HttpResponse.json(
          { message: "Missing fields" },
          { status: 400 }
        );
      }

      const newTask = {
        id: uuidv4(),
        name,
        status,
        priority,
        createdAt: new Date().toISOString(),
        createdBy: user.id,
      };

      await db.tasks.add(newTask);

      // Add team members to task_team
      for (const userId of assignedUserIds) {
        await db.task_team.add({
          id: uuidv4(),
          taskId: newTask.id,
          userId,
        });
      }
      const isTeamTask = assignedUserIds.length > 1;
      const responseKey = isTeamTask ? "addTeamTask" : "addOwnTask";

      return HttpResponse.json(
        {
          task: newTask,
          action: responseKey,
        },
        { status: 201 }
      );
    } catch (err) {
      return HttpResponse.json({ message: err.message }, { status: 401 });
    }
  }),

  // 2. GET ALL TASKS
  http.get("/api/tasks", async ({ request }) => {
    try {
      const user = await getUserFromRequest(request);

      const taskLinks = await db.task_team
        .where("userId")
        .equals(user.id)
        .toArray();

      const associatedTaskIds = taskLinks.map((link) => link.taskId);
      const associatedTasks = await db.tasks.bulkGet(associatedTaskIds);

      const own = [];
      const team = [];

      for (const task of associatedTasks) {
        if (!task) continue;

        const assignedLinks = await db.task_team
          .where("taskId")
          .equals(task.id)
          .toArray();

        const assignedUserIds = new Set(
          assignedLinks.map((link) => link.userId)
        );

        // Check if only the creator is assigned
        if (assignedUserIds.size === 1 && assignedUserIds.has(task.createdBy)) {
          own.push(task);
        } else {
          team.push(task);
        }
      }

      return HttpResponse.json({ own, team }, { status: 200 });
    } catch (err) {
      return HttpResponse.json({ message: err.message }, { status: 401 });
    }
  }),

  // 3. UPDATE TASK
  http.put("/api/task/:id", async ({ params, request }) => {
    const { id } = params;
    const data = await request.json();

    const task = await db.tasks.get(id);
    if (!task) {
      return HttpResponse.json({ message: "Task not found" }, { status: 404 });
    }

    const updated = { ...task, ...data };
    await db.tasks.put(updated);

    return HttpResponse.json({ task: updated }, { status: 200 });
  }),

  // 4. DELETE TASK
  http.delete("/api/task/:id", async ({ params, request }) => {
    try {
      const { id } = params;
      await getUserFromRequest(request);

      const task = await db.tasks.get(id);
      if (!task) {
        return HttpResponse.json(
          { message: "Task not found" },
          { status: 404 }
        );
      }

      await db.tasks.delete(id);
      await db.task_team.where("taskId").equals(id).delete();

      return HttpResponse.json(
        { message: "Task deleted successfully" },
        { status: 200 }
      );
    } catch (err) {
      return HttpResponse.json({ message: err.message }, { status: 500 });
    }
  }),
];
