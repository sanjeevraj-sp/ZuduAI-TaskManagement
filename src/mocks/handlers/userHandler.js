import { http, HttpResponse } from "msw";
import { db } from "../db";

export const userHandlers = [
  http.get("/api/users", async () => {
    try {
      const users = await db.users.toArray();

      // Reconstruct user object excluding password
      const usersWithoutPasswords = users.map(user => {
        const userCopy = { ...user };
        delete userCopy.password;
        return userCopy;
      });

      return HttpResponse.json(usersWithoutPasswords, { status: 200 });
    } catch (err) {
      return HttpResponse.json(
        { message: "Failed to fetch users" },
        { status: 500 }
      );
    }
  }),
];
