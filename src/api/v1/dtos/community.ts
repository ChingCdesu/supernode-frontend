import { Device } from "./devices";

export interface Community {
  id: number;
  name: string;
  subnet: string;
  encryption: boolean;
  devices: Device[];
  totalUserCount?: number;
  onlineUserCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCommunityDto {
  name: string;
  subnet: string;
  encryption: boolean;
}

export type UpdateCommunityDto = Partial<CreateCommunityDto>;

export interface TransferCommunityDto {
  name: string;
  subnet?: string;
  encryption?: boolean;
  devices?: Device[];
}