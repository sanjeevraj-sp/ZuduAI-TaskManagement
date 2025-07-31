import { db } from "../db";

function base64(obj) {
  // Encode to base64url (replace +, /, and remove =)
  return btoa(JSON.stringify(obj))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function createJWT(payload, expiresIn = "1h") {
  const header = { alg: "HS256", typ: "JWT" };

  // Calculate expiration in seconds
  let exp = Math.floor(Date.now() / 1000);
  if (typeof expiresIn === "string" && expiresIn.endsWith("h")) {
    exp += parseInt(expiresIn) * 60 * 60;
  } else if (typeof expiresIn === "string" && expiresIn.endsWith("m")) {
    exp += parseInt(expiresIn) * 60;
  } else if (typeof expiresIn === "number") {
    exp += expiresIn;
  } else {
    exp += 60 * 60; // default 1 hour
  }

  const payloadWithExp = { ...payload, exp };

  const token = `${base64(header)}.${base64(payloadWithExp)}.mock-signature`;
  return token;
}

export function validateJWT(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return { valid: false, reason: "Malformed token" };

    const payloadBase64 = parts[1];
    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson);

    // 1. Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (!payload.exp || payload.exp < now) {
      return { valid: false, reason: "Token expired" };
    }

    return { valid: true, payload };
  } catch (err) {
    return { valid: false, reason: "Invalid token format" };
  }
}

// Reusable function to extract and validate user from token
export async function getUserFromRequest(request) {
  const authHeader = request.headers.get("Authorization") || "";
  const token = authHeader.replace("Bearer ", "");
  const { valid, payload, reason } = validateJWT(token);
  if (!valid) {
    throw new Error(reason || "Unauthorized");
  }

  const user = await db.users.get(payload.id);
  if (!user) throw new Error("User not found");

  return user;
}