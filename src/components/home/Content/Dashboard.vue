<script lang="ts" setup>
import { Ref, onMounted, ref } from "vue";
import { NCard } from "naive-ui";
import { useInterval } from "@vueuse/core";
import { useI18n } from "vue-i18n";
import { listDevices } from "@/api/v1/business/devices";
import { Device } from "@/api/v1/dtos/devices";

const { t } = useI18n();
const { pause, resume } = useInterval(3000, {
  controls: true,
  immediate: false,
  callback: getDevices,
});

const myDevicesCount = ref(0);

onMounted(() => {
  resume();
});

function getDevices() {
  listDevices()
    .then((res) => {
      myDevicesCount.value = res.data.data?.length ?? 0;
    })
    .catch((err) => {
      console.log(err);
    });
}
</script>

<template>
  <div class="p-2">
    <NCard>
      <template #header>
        <span>{{ $t("message.dashboard.myDevices") }}</span>
      </template>
      <template #default>
        <div class="text-4xl text-center">{{ myDevicesCount }}</div>
      </template>
    </NCard>
  </div>
</template>
