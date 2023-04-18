<script lang="ts" setup>
import { NButton, NCard, NSpace, NText, NTime } from "naive-ui";
import { Icon } from "@vicons/utils";
import { TrashX } from "@vicons/tabler";

import { Device } from "@/api/v1/dtos/devices";

const props = defineProps<{
  device: Device;
}>();
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
      <NButton text circle type="error">
        <template #icon>
          <Icon><TrashX /></Icon>
        </template>
      </NButton>
    </template>
    <template #default>
      <NSpace vertical>
        <NText>
          {{ $t("message.devices.createdAt") }}:
          <NTime :time="new Date(props.device.createdAt)" />
        </NText>
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
          <NTime :time="new Date(props.device.lastSeen!)" />
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
