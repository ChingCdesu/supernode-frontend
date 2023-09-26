<script lang="ts" setup>
import { NewDeviceDto } from "@/api/v1/dtos/devices";
import { Supernode } from "@/api/v1/dtos/supernode";
import { getServerInfo } from "@/api/v1/common/supernode";
import { NCard, NText, NButton } from "naive-ui";
import { ref, onMounted, type Ref } from "vue";

const props = defineProps<{
  device: NewDeviceDto;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const serverInfo: Ref<Supernode | undefined> = ref();

onMounted(async () => {
  const response = await getServerInfo();
  serverInfo.value = response.data.data;
});
</script>

<template>
  <NCard class="w-1/2">
    <template #header>
      <NText>{{ $t("message.newDevice.deviceAdded") }}</NText>
    </template>
    <template #default>
      <div>supernode: {{ JSON.stringify(serverInfo) }}</div>
      <div>device: {{ JSON.stringify(props.device) }}</div>
    </template>
    <template #footer>
      <NButton secondary @click="emit('close')">
        {{ $t("message.common.close") }}
      </NButton>
    </template>
  </NCard>
</template>
