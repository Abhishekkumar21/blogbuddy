import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/jwt";
import { signinInput, signupBody } from "@abhie.npm/blogbuddy-common";

type Bindings = {
  DATABASE_URL: string;
  JWT_SECRET: string;
};
const userRouter = new Hono<{ Bindings: Bindings }>();

userRouter.post("/signup", async (c) => {
  // initialize prisma client which is used to interact with the database
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  //extracting the input from incoming http request body and parsing it to json
  const body = await c.req.json();
  // Validate the request body against the signupInput zod schema and check if it's valid
  const { success } = signupBody.safeParse(body);
  // if request body containg user input does not follow the signupBody zod schema, then return invalid input
  if (!success) {
    c.status(400);
    return c.json({ error: "Invalid input!" });
  }
  //if user input is valid
  try {
    //find the user in database with email provided by user
    const userAlreadyExists = await prisma.user.findUnique({
      where: { email: body.email },
    });
    //if user already exists in database, return user already exists
    if (userAlreadyExists) {
      return c.json({ error: "User already exists.Please Login!" }, 400);
    }
    //user(email) not in database then create new user with provided email and password
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
      },
    });
    //when user created, generate a jwt token with secret and user id(created by database)
    const secret = c.env.JWT_SECRET;
    const token = await sign({ id: user.id }, secret); //sign(payload, secret)
    c.status(200);
    return c.json({
      message: "User created successfully.",
      jwtToken: token,
    });
  } catch (e) {
    //it will catch the error encountered in try block during user creation in database
    c.status(403);
    return c.json({
      message: "Error while signing up!",
    });
  }
});

userRouter.post("/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  //input validation
  const { success } = signinInput.safeParse(body);

  if (!success) {
    c.status(400);
    return c.json({
      error: "Input(s) not valid",
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
        password: body.password,
      },
    });
    if (!user) {
      c.status(403);
      return c.json({
        error: "user not found!",
      });
    }
    const secret = c.env.JWT_SECRET;
    const token = await sign({ id: user.id }, secret); //sign(payload, secret)
    c.status(200);
    return c.json({
      message: "User found successfully!",
      jwtToken: token,
    });
  } catch (e) {
    c.status(403);
    return c.json({
      message: "Error while signing in!",
    });
  }
});

export default userRouter;
