// mocks/db.js
import Dexie from "dexie";
import { v4 as uuidv4 } from "uuid";

class MyDatabase extends Dexie {
  constructor() {
    super("MockDB");

    // Define schema
    this.version(1).stores({
      users: "id, email, role",
      roles: "id, name",
      actions: "id, name",
      scopes: "id, name",
      privileges: "++id, roleId, actionId, scopeId",
      tasks: "id, name, createdBy, status, priority, createdAt",
      task_team: "++id, taskId, userId",
    });

    this.on("populate", () => {
      this.seed();
    });

    // Tables
    this.users = this.table("users");
    this.roles = this.table("roles");
    this.actions = this.table("actions");
    this.scopes = this.table("scopes");
    this.privileges = this.table("privileges");
    this.tasks = this.table("tasks");
    this.task_team = this.table("task_team");
  }

  async seed() {
    console.log("🌱 Seeding database with initial data...");

    // Roles
    const roleMap = {
      Admin: uuidv4(),
      Manager: uuidv4(),
      User: uuidv4(),
    };
    await this.roles.bulkAdd([
      { id: roleMap.Admin, name: "Admin" },
      { id: roleMap.Manager, name: "Manager" },
      { id: roleMap.User, name: "User" },
    ]);

    // Actions
    const actionMap = {
      create: uuidv4(),
      read: uuidv4(),
      update: uuidv4(),
      delete: uuidv4(),
    };
    await this.actions.bulkAdd([
      { id: actionMap.create, name: "create" },
      { id: actionMap.read, name: "read" },
      { id: actionMap.update, name: "update" },
      { id: actionMap.delete, name: "delete" },
    ]);

    // Scopes
    const scopeMap = {
      own: uuidv4(),
      team: uuidv4(),
    };
    await this.scopes.bulkAdd([
      { id: scopeMap.own, name: "own" },
      { id: scopeMap.team, name: "team" },
    ]);

    // Privileges
    const privileges = [];

    // Admin: Full access on both scopes
    Object.values(actionMap).forEach((actionId) => {
      Object.values(scopeMap).forEach((scopeId) => {
        privileges.push({
          roleId: roleMap.Admin,
          actionId,
          scopeId,
        });
      });
    });

    // Manager: CRUD own tasks + Read/Update team tasks
    ["create", "read", "update", "delete"].forEach((action) => {
      privileges.push({
        roleId: roleMap.Manager,
        actionId: actionMap[action],
        scopeId: scopeMap.own,
      });
    });
    ["read", "update"].forEach((action) => {
      privileges.push({
        roleId: roleMap.Manager,
        actionId: actionMap[action],
        scopeId: scopeMap.team,
      });
    });

    // User: CRUD own tasks + Read team tasks
    ["create", "read", "update", "delete"].forEach((action) => {
      privileges.push({
        roleId: roleMap.User,
        actionId: actionMap[action],
        scopeId: scopeMap.own,
      });
    });
    privileges.push({
      roleId: roleMap.User,
      actionId: actionMap.read,
      scopeId: scopeMap.team,
    });

    await this.privileges.bulkAdd(privileges);

    // Users
    const users = [
      {
        id: uuidv4(),
        name: "Zudu Admin",
        email: "admin@zudu.com",
        password: "admin123",
        role: "Admin",
      },
      {
        id: uuidv4(),
        name: "Zudu Manager",
        email: "manager@zudu.com",
        password: "manager123",
        role: "Manager",
      },
      {
        id: uuidv4(),
        name: "Zudu User",
        email: "user@zudu.com",
        password: "user123",
        role: "User",
      },
    ];

    await this.users.bulkAdd(users);

    // Tasks
    const now = new Date().toISOString();
    const sampleTasks = [
      {
        id: uuidv4(),
        name: "Admin Task 1",
        status: "Todo",
        priority: 2,
        createdAt: now,
        createdBy: users[0].id,
      },
      {
        id: uuidv4(),
        name: "Manager Task 1",
        status: "In Progress",
        priority: 1,
        createdAt: now,
        createdBy: users[1].id,
      },
      {
        id: uuidv4(),
        name: "User Task 1",
        status: "Done",
        priority: 0,
        createdAt: now,
        createdBy: users[2].id,
      },
    ];

    await this.tasks.bulkAdd(sampleTasks);

    // Task Team (Assign Admin's task to Manager and User)
    await this.task_team.bulkAdd([
      {
        taskId: sampleTasks[0].id,
        userId: users[1].id, // Manager
      },
      {
        taskId: sampleTasks[0].id,
        userId: users[2].id, // User
      },
    ]);
  }
}

export const db = new MyDatabase();

export async function seedIfEmpty() {
  console.log("🔍 Checking if database is empty...");
  const count = await db.users.count();
  if (count === 0) {
    console.log("🌱 DB is empty. Seeding...");
    await db.seed();
  } else {
    console.log("✅ DB already seeded.");
  }
}

// Seed on startup
seedIfEmpty();
