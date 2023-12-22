import API from '@/services/inceptor';

export const SignUp = (data: User) => API.post('/registration', data);
export const Login = (data: LoginSchema) => API.post('/login', data);
export const CreatePost = (data: Post[]) => API.post('/create-post', data);
