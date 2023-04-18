import { Community } from "./community";

export interface Device {
  id: number;
  name: string;
  publicKey: string;
  isOnline: boolean;
  community: Community;
  mac?: string;
  ip?: string;
  protocol?: 'TCP' | 'UDP';
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
  ownerId: number;
}

export type ManagementUpdateDeviceDto = Partial<ManagementCreateDeviceDto>;
