export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData extends LoginFormData {
  passwordConfirmation: string;
}

export interface AuthError {
  message: string;
} 