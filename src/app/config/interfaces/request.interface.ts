import { User } from "./check-token.interface";


export interface RegisterResponse {
  msg: string;
  user: CreateUser;
  statusCode?: number;
}

export interface LoginResponse {
  user: User
  token: string;
}

export interface CreateUser {
  name:     string ;
  email:    string ;
  password: string ;
}

export interface LoginUser {
  email:    string ;
  password:     string ;
}
