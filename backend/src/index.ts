import { Hono } from "hono";
import userRouter from "./routes/user";
import blogRouter from "./routes/blog";

type Bindings = {
  DATABASE_URL: string; // DATABASE_URL from wrangler.toml
  JWT_SECRET: string; //JWT_SECRET  from wrangler.toml
};
const app = new Hono<{ Bindings: Bindings }>();

app.get("/", (c) => {
  return c.text("Hello World");
});
app.route("/api/v1/user", userRouter);
app.route("/api/v1/blog", blogRouter);

export default app;
