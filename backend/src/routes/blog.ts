import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import authMiddleware from "../middlewares/authenticationMiddleware";
import { createPostInput, updatePostInput } from "@abhie.npm/blogbuddy-common";

type Bindings = {
  DATABASE_URL: string;
  JWT_SECRET: string;
};

type Variables = {
  UserId: string;
};
const blogRouter = new Hono<{ Bindings: Bindings; Variables: Variables }>();

//auth middleware
blogRouter.use("/*", authMiddleware);

//creating a blog
blogRouter.post("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();
  //zod input validation
  const { success } = createPostInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({ error: "Input not valid" });
  }
  // getting the user id  attached in context in auth middleware
  const authorId = c.get("UserId");
  try {
    const blog = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: authorId, //extracted from authentication middleware
      },
    });
    c.status(201);
    return c.json({ id: blog.id });
  } catch (e) {
    c.status(500);
    return c.json({ error: "Couldn't create the blog,Internal Server Error" });
  }
});

//updating a blog
blogRouter.put("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  //zod input validation
  const { success } = updatePostInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({ error: "Input not valid" });
  }
  try {
    const blog = await prisma.post.update({
      where: {
        id: body.id,
      },
      data: {
        title: body.title,
        content: body.content,
      },
    });
    c.status(200);
    return c.json({ id: blog.id });
  } catch (e) {
    c.status(404);
    return c.json({ error: "Blog not found or update failed" });
  }
});

//fetching all the blogs
blogRouter.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const blogs = await prisma.post.findMany();
    c.status(200);
    return c.json({ blogs: blogs });
  } catch (e) {
    c.status(500);
    return c.json({ error: "Internal Server Error" });
  }
});

//fetching a complete blog
blogRouter.get("/:id", async (c) => {
  const id = c.req.param("id");
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const blog = await prisma.post.findFirst({
      where: {
        id: id,
      },
    });
    if (!blog) {
      c.status(404);
      return c.json({ message: "Blog not found" });
    }
    c.status(200);
    return c.json({ blog: blog });
  } catch (e) {
    c.status(500);
    c.json({ error: "failed to fetch, Internal Server Error" });
  }
});

export default blogRouter;
