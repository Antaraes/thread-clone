import {z} from 'zod';

export const UserShema = z.object({
  email: z.string(),
  password: z.string(),
  name: z.string(),
  avatar: z.string(),
});
export const PostSchema = z.array(
  z.object({
    title: z.string({required_error: 'Title is required'}),
    image: z.string({required_error: 'Image is required'}),
    user: UserShema,
  }),
);
