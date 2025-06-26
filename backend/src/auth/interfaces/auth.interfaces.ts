export interface AuthUser {
  id: string;
  username: string;
}

export interface AuthToken {
  accessToken: string;
}

export interface JwtPayload {
  sub: string;
  username: string;
}

export interface AuthResult {
  user: AuthUser;
  token: AuthToken;
}

export interface UserCredentials {
  username: string;
  password: string;
}
