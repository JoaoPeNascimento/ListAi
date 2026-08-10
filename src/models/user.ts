export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface UserSummary {
  id: string;
  name: string;
  email: string;
}

export interface UserSession {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export interface UserCreateInput {
  name: string;
  email: string;
  password: string;
}

export interface UserLoginInput {
  email: string;
  password: string;
}
