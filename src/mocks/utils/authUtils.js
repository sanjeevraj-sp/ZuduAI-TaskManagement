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
