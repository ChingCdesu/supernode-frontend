export interface User {
  id: number;
  name: string;
  email?: string;
  isAdmin: boolean;
  issuer: string;
  uniqueId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDto {
  name: string;
  email?: string;
  isAdmin?: boolean;
  password?: string;
}

export type UpdateUserDto = Partial<CreateUserDto>;
