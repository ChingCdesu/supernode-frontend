<script lang="ts" setup>
import { Ref, onMounted, ref, computed } from "vue";
import {
  NList,
  NListItem,
  NGrid,
  NGridItem,
  NEmpty,
  NButton,
  NH3,
  NSpace,
  useLoadingBar,
} from "naive-ui";
import { useInterval } from "@vueuse/core";
import { MoodConfuzed, Plus } from "@vicons/tabler";
import { Icon } from "@vicons/utils";
import { uniqBy } from "lodash";

import DeviceCard from "./DeviceCard.vue";

import { listDevices } from "@/api/v1/business/devices";
import { Device } from "@/api/v1/dtos/devices";
import { Community } from "@/api/v1/dtos/community";

interface CommunityWithDevices extends Community {
  devices?: Device[];
}

const loadingBar = useLoadingBar();
const firstLoading = ref(true);

const myDevices: Ref<Device[]> = ref([]);
const joinedCommunities = computed(() => {
  const communities = uniqBy(
    myDevices.value.map((device) => device.community),
    "id"
  ) as CommunityWithDevices[];
  for (const community of communities) {
    community.devices = myDevices.value.filter(
      (device) => device.community.id === community.id
    );
  }
  return communities;
});

function getDevices() {
  if (firstLoading.value) {
    loadingBar.start();
  }
  listDevices()
    .then((res) => {
      myDevices.value = res.data.data ?? [];
      if (firstLoading.value) {
        loadingBar.finish();
      }
    })
    .catch((err) => {
      if (firstLoading.value) {
        loadingBar.error();
      }
      throw err;
    })
    .finally(() => {
      firstLoading.value = false;
    });
}

onMounted(() => {
  useInterval(3000, {
    callback: getDevices,
  });
});
</script>

<template>
  <div>
    <NList class="p-4">
      <NListItem v-for="community of joinedCommunities" :key="community.id">
        <div class="flex justify-between">
          <NH3>
            <span>{{ $t("message.common.community") }}:&nbsp;</span>
            <span>{{ community.name }}</span>
          </NH3>
          <NSpace>
            <NButton quaternary circle>
              <template #icon>
                <Icon><Plus /></Icon>
              </template>
            </NButton>
          </NSpace>
        </div>
        <NGrid v-if="community.devices" :cols="4" :x-gap="12">
          <NGridItem v-for="device of community.devices">
            <DeviceCard :device="device" />
          </NGridItem>
        </NGrid>
      </NListItem>
    </NList>
    <div class="empty-tip" v-show="myDevices.length === 0">
      <NEmpty :description="$t('message.devices.emptyTip')">
        <template #icon>
          <Icon><MoodConfuzed /></Icon>
        </template>
        <template #extra>
          <NButton size="small" type="primary">
            {{ $t("message.devices.emptyAddTip") }}
          </NButton>
        </template>
      </NEmpty>
    </div>
  </div>
</template>

<style lang="less" scoped>
.empty-tip {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
}
</style>
