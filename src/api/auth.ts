import * as request from "@/utils/request";
import { User } from "./v1/users";

export function login(username: string, password: string) {
  return request.Post<User>("/auth/login", { username, password });
}

export function logout() {
  return request.Delete("/auth/logout");
}
