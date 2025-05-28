export class LoginDto {
  email: string;
  password: string;
}

export class RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
} 