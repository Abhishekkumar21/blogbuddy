import { z } from "zod";

export const signupBody = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
});

export const signinInput = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const createPostInput = z.object({
  title: z.string(),
  content: z.string(),
});

export const updatePostInput = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  id: z.string(),
});

export type updatePostType = z.infer<typeof updatePostInput>;
export type createPostType = z.infer<typeof createPostInput>;
export type signinType = z.infer<typeof signinInput>;
export type signupType = z.infer<typeof signupBody>;
