import * as request from "@/utils/request";

import { User, CreateUserDto, UpdateUserDto } from "@/api/v1/dtos/users";

export function listUsers(pagination?: Partial<request.PaginationParams>) {
  return request.Get<request.PaginationResponse<User>>("/v1/users", pagination);
}

export function addUser(user: CreateUserDto) {
  return request.Post<User>("/v1/users", user);
}

export function getUserById(userId: number) {
  return request.Get<User>(`/v1/users/${userId}}`);
}

export function updateUserInfo(userId: number, updateInfo: UpdateUserDto) {
  return request.Put(`/v1/users/${userId}`, updateInfo);
}

export function deleteUser(userId: number) {
  return request.Delete(`/v1/users/${userId}`);
}

export function getMe() {
  return request.Get<User>("/v1/users/me");
}

export function updateMe(updateInfo: UpdateUserDto) {
  return request.Put("/v1/users/me", updateInfo);
}
