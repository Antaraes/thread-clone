import z from 'zod';
export const LoginSchema = z.object({
  email: z
    .string({required_error: 'Email is required'})
    .email()
    .min(1, {message: 'Email is required'}),
  password: z
    .string()

    .min(1, {message: 'Password is required'}),
});

export const RegisterSchema = z
  .object({
    name: z
      .string({required_error: 'Name is required'})
      .min(1, {message: 'Name is required'}),
    email: z
      .string({required_error: 'Email is required'})
      .email()
      .min(1, {message: 'Email is required'}),
    password: z
      .string({required_error: 'Password is required'})
      .min(1, {message: 'Password is required'}),
    confirm: z
      .string({required_error: 'Confirm Password is required'})
      .min(1, {message: 'Confirm Password is required'}),
    avatar: z.string(),
  })
  .refine(data => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ['confirm'],
  });
