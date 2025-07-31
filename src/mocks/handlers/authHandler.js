// msw/handlers/auth.js
import { http, HttpResponse } from "msw";

import { findUserByEmail, registerUser } from "../services/authServices";
import { createJWT } from "../utils/authUtils";

export const authHandlers = [
  http.post("/api/auth/login", async ({ request }) => {
    const { email, password } = await request.json();
    const user = await findUserByEmail(email);

    if (!user) {
      return HttpResponse.json({ message: "User not found" }, { status: 401 });
    }

    if (user.password !== password) {
      return HttpResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = createJWT({
      id: user.id,
      email: user.email,
      role: user.role,
      roleId: user.roleId,
      roleName: user.roleName,
    });

    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;

    return HttpResponse.json(
      {
        token,
        user: {
          ...userWithoutPassword,
          roleId: user.roleId,
          roleName: user.roleName,
        },
      },
      { status: 200 }
    );
  }),

  http.post("/api/auth/register", async ({ request }, ctx) => {
    const { name, email, password } = await request.json();

    try {
      const user = await registerUser({ name, email, password });

      const token = createJWT({
        id: user.id,
        email: user.email,
        role: user.role,
        roleId: user.roleId,
        roleName: user.roleName,
      });

      const userWithoutPassword = { ...user };
      delete userWithoutPassword.password;

      return HttpResponse.json(
        {
          token,
          user: {
            ...userWithoutPassword,
            roleId: user.roleId,
            roleName: user.roleName,
          },
        },
        { status: 200 }
      );
    } catch (err) {
      return ctx.json({ message: err.message }, 400);
    }
  }),
];