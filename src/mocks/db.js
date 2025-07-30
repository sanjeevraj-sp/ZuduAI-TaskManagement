// mocks/db.js
import Dexie from "dexie";
import { v4 as uuidv4 } from "uuid";

class MyDatabase extends Dexie {
  constructor() {
    super("MockDB");

    // Define schema
    this.version(1).stores({
      users: "id, email, role",
    });

    // Seed if DB is created fresh
    this.on("populate", () => {
      this.seed();
    });

    this.users = this.table("users");
  }

  async seed() {
    console.log("🌱 Seeding database with initial data...");
    await this.users.bulkAdd([
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

// Ensure seeding on load or refresh
seedIfEmpty();
