import * as request from "@/utils/request";

import {
  Device,
  ManagementCreateDeviceDto,
  ManagementUpdateDeviceDto,
} from "@/api/v1/dtos/devices";

export function listDevices(
  communityId: number,
  pagination?: Partial<request.PaginationParams>
) {
  return request.Get<request.PaginationResponse<Device>>(
    `/v1/management/communities/${communityId}/devices`,
    pagination
  );
}

export function addDevice(communityId: number, device: ManagementCreateDeviceDto) {
  return request.Post<Device>(
    `/v1/management/communities/${communityId}/devices`,
    device
  );
}

export function getDeviceById(communityId: number, deviceId: number) {
  return request.Get<Device>(
    `/v1/management/communities/${communityId}/devices/${deviceId}}`
  );
}

export function updateDeviceInfo(
  communityId: number,
  deviceId: number,
  updateInfo: ManagementUpdateDeviceDto
) {
  return request.Put(
    `/v1/management/communities/${communityId}/devices/${deviceId}`,
    updateInfo
  );
}

export function deleteDevice(communityId: number, deviceId: number) {
  return request.Delete(
    `/v1/management/communities/${communityId}/devices/${deviceId}`
  );
}
