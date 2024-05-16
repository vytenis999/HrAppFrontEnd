export class UserLogin {
  email: string = '';
  password: string = '';
}

export class ForgotPassword {
  email?: string;
  clientURI?: string;
}

export interface ResetPasswordDto {
  password?: string;
  confirmPassword?: string;
  email?: string;
  token?: string;
}
