type User = {
  email: string;
  password: string;
  name: string;
  avatar: string;
};

type LoginSchema = {
  email: string;
  password: string;
};

type SignUpSchema = {
  email: string;
  password: string;
  confirm: string;
  name: string;
  avatar: string;
};

type Post = {
  title: string;
  image: string;
  previewImage: string;
  user: User;
};
