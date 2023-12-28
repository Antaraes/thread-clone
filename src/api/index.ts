import API from '@/services/inceptor';

export const SignUp = (data: User) => API.post('/registration', data);
export const Login = (data: LoginSchema) => API.post('/login', data);
export const CreatePost = (data: Post[]) => API.post('/create-post', data);
export const GetAllUsers = async () => {
  try {
    const response = await API.get('/users');
    return response.data;
  } catch (error) {
    console.error('Error in GetAllUsers:', error.response || error.message);
    throw error;
  }
};
export const GetUserDetails = async () => API.get('/me');
export const followAndUnfolllow = async (folllowUserId: string) =>
  API.put('/add-user');
