import * as request from "@/utils/request";

import {
  Device,
  BusinessCreateDeviceDto,
  BusinessUpdateDeviceDto,
} from "@/api/v1/dtos/devices";

export function listDevices() {
  return request.Get<Device[]>(
    "/v1/devices"
  );
}

export function addDevice(device: BusinessCreateDeviceDto) {
  return request.Post<Device>("/v1/devices", device);
}

export function getDeviceById(deviceId: number) {
  return request.Get<Device>(`/v1/devices/${deviceId}}`);
}

export function updateDeviceInfo(
  deviceId: number,
  updateInfo: BusinessUpdateDeviceDto
) {
  return request.Put(`/v1/devices/${deviceId}`, updateInfo);
}

export function deleteDevice(deviceId: number) {
  return request.Delete(`/v1/devices/${deviceId}`);
}
