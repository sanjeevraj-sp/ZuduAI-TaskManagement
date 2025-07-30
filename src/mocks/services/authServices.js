// mocks/services/authServices.js
import { db } from "../db";
import { v4 as uuidv4 } from "uuid";

export const registerUser = async ({ name, email, password }) => {
  const existing = await db.users.where("email").equals(email).toArray();
  if (existing.length > 0) {
    throw new Error("Email already in use");
  }

  const newUser = {
    id: uuidv4(),
    name,
    email,
    password,
    role: "Admin", // Default role
  };

  await db.users.add(newUser);
  return newUser;
};

export const findUserByEmail = async (email) => {
  const users = await db.users.where("email").equals(email).toArray();
  return users[0];
};


