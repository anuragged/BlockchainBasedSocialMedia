export interface User {
  uid: string;
  email: string;
  fullName: string;
  dateOfBirth: string;
  createdAt: string;
  avatarUrl?: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  dateOfBirth: string;
}