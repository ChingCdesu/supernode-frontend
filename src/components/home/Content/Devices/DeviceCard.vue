<script lang="ts" setup>
import { NButton, NCard, NSpace, NText, NTime, NPopconfirm } from "naive-ui";
import { Icon } from "@vicons/utils";
import { TrashX } from "@vicons/tabler";

import { useUserState } from "@/store/user";

import type { Device } from "@/api/v1/dtos/devices";
import { deleteDevice } from "@/api/v1/business/devices";

const props = defineProps<{
  device: Device;
}>();

const emit = defineEmits(["deleted"]);

const { user } = useUserState();

function removeThisDevice() {
  deleteDevice(props.device.id).then(() => emit("deleted"));
}
</script>

<template>
  <NCard segmented>
    <template #header>
      <NSpace align="center" size="small">
        <div
          class="status-circle"
          :class="props.device.isOnline ? 'online' : ''"
        />
        <NText class="text-xl mr-1">{{ props.device.name }}</NText>
      </NSpace>
    </template>
    <template #header-extra>
      <NPopconfirm
        @positive-click="removeThisDevice"
        v-if="user?.id === props.device.owner.id"
      >
        <template #trigger>
          <NButton text circle type="error">
            <template #icon>
              <Icon>
                <TrashX />
              </Icon>
            </template>
          </NButton>
        </template>
        <template #default>
          <NText>{{ $t("message.devices.deleteConfirm") }}</NText>
        </template>
      </NPopconfirm>
    </template>
    <template #default>
      <NSpace vertical>
        <NText v-if="props.device.isOnline">
          {{ $t("message.devices.ip", { ip: props.device.ip }) }}
        </NText>
        <NText v-if="props.device.isOnline">
          {{
            $t("message.devices.protocol", { protocol: props.device.protocol })
          }}
        </NText>
        <NText v-if="props.device.isOnline">
          {{ $t("message.devices.mac", { mac: props.device.mac }) }}
        </NText>
        <NText v-if="props.device.isOnline">
          {{ $t("message.devices.lastSeen") }}:
          <NTime :time="new Date(props.device.lastSeen! * 1000)" />
        </NText>
        <NText>
          {{ $t("message.devices.createdAt") }}:
          <NTime :time="new Date(props.device.createdAt)" />
        </NText>
        <NText>
          {{ $t("message.devices.owner") }}:
          <NText strong>{{ props.device.owner.name }}</NText>
        </NText>
      </NSpace>
    </template>
  </NCard>
</template>

<style lang="less" scoped>
.status-circle {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #a3a3a3;

  &.online {
    background-color: #4ade80;
  }
}
</style>
