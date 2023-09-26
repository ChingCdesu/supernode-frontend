import type { Community } from "./community";
import type { User } from "./users";
export interface Device {
  id: number;
  name: string;
  publicKey: string;
  isOnline: boolean;
  community: Community;
  mac?: string;
  ip?: string;
  protocol?: "TCP" | "UDP";
  owner: User;
  lastSeen?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface BusinessCreateDeviceDto {
  name: string;
  publicKey: string;
  communityId: number;
}

export type BusinessUpdateDeviceDto = Partial<BusinessCreateDeviceDto>;

export interface ManagementCreateDeviceDto {
  name: string;
  publicKey: string;
  communityId: number;
  ownerId: number;
}

export type ManagementUpdateDeviceDto = Partial<ManagementCreateDeviceDto>;

export interface NewDeviceDto {
  name: string;
  communityId: number;
  password: string;
}