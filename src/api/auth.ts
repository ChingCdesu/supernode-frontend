import * as request from "@/utils/request";
import { User } from "./v1/users";

export function localLogin(username: string, password: string) {
  return request.Post<User>("/auth/login", { username, password });
}

export function localLogout() {
  return request.Delete("/auth/logout");
}
