export interface User {
  id: string;
  username: string;
  passwordHash: string;
  salt: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDto {
  username: string;
  password: string;
}

export interface LoginUserDto {
  username: string;
  password: string;
}

export interface UserResponseDto {
  id: string;
  username: string;
  createdAt: Date;
}
