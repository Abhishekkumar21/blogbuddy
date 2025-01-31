import { Context, Next } from "hono";
import { verify } from "hono/jwt";

const authMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header("Authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split("Bearer ")[1]
    : null;

  if (!token) {
    c.status(401);
    return c.json({ error: "Unauthorized! Missing authentication token." });
  }

  try {
    const decodedToken = await verify(token, c.env.JWT_SECRET);
    if (!decodedToken) {
      c.status(401);
      return c.json({ error: "Unauthorized! Invalid authentication token." });
    }
    // Store user ID in context
    c.set("UserId", decodedToken.id);
    return next();
  } catch (e) {
    c.status(401);
    return c.json({ error: "Unauthorized! Invalid or expired token." });
  }
};

export default authMiddleware;
