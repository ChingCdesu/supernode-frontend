<script lang="ts" setup>
import { type Ref, onMounted, ref } from "vue";
import {
  NList,
  NListItem,
  NGrid,
  NGridItem,
  NEmpty,
  NButton,
  NH3,
  NSpace,
  NModal,
  useLoadingBar,
} from "naive-ui";
import { Crown, Plus, Refresh } from "@vicons/tabler";
import { Icon } from "@vicons/utils";

import DeviceCard from "./DeviceCard.vue";
import NewDeviceModal from "./NewDeviceModal.vue";
import NewDeviceResult from "./NewDeviceResult.vue";

import { Community } from "@/api/v1/dtos/community";
import { listCommunities } from "@/api/v1/business/community";
import { NewDeviceDto } from "@/api/v1/dtos/devices";

const loadingBar = useLoadingBar();

const firstLoading = ref(true);
const showNewDeviceModal = ref(false);
const showNewDeviceResult = ref(false);

const allCommunities: Ref<Community[]> = ref([]);
const newDevicePresetCommunity: Ref<Community | undefined> = ref();
const newDevice: Ref<NewDeviceDto | undefined> = ref();

async function getCommunities() {
  let page = 1;
  let stop = false;
  const communities: Community[] = [];

  if (firstLoading.value) {
    loadingBar.start();
  }

  while (!stop) {
    try {
      const res = await listCommunities({ page, limit: 100 }, true);
      const arr = res.data.data?.data ?? [];
      communities.push(...arr);
      page += 1;
      if (!!!res.data.data?.meta.hasNextPage) {
        if (firstLoading.value) {
          loadingBar.finish();
          firstLoading.value = false;
        }
        stop = true;
      }
    } catch (err) {
      if (firstLoading.value) {
        loadingBar.error();
        firstLoading.value = false;
      }
      console.error(err);
      stop = true;
    }
  }
  allCommunities.value = communities;
}

async function addDevice(preset?: Community) {
  newDevicePresetCommunity.value = preset;
  showNewDeviceModal.value = true;
}

function addedDevice(device: NewDeviceDto) {
  newDevice.value = device;
  showNewDeviceResult.value = true;
  getCommunities();
}

onMounted(getCommunities);
</script>

<template>
  <div class="p-4">
    <NSpace justify="end" align="center">
      <NButton quaternary circle @click="getCommunities">
        <template #icon>
          <Refresh />
        </template>
      </NButton>
    </NSpace>
    <NList>
      <NListItem v-for="community of allCommunities" :key="community.id">
        <div class="flex justify-between">
          <NH3>
            <span>{{ $t("message.common.community") }}:&nbsp;</span>
            <span>{{ community.name }}</span>
          </NH3>
          <NSpace>
            <NButton quaternary circle @click="() => addDevice(community)">
              <template #icon>
                <Icon>
                  <Plus />
                </Icon>
              </template>
            </NButton>
          </NSpace>
        </div>
        <div
          class="flex justify-center items-center w-full my-5"
          v-show="community.devices.length === 0"
        >
          <NEmpty :description="$t('message.devices.emptyTip')">
            <template #icon>
              <Icon>
                <Crown />
              </Icon>
            </template>
            <template #extra>
              <NButton
                size="small"
                type="primary"
                @click="() => addDevice(community)"
              >
                {{ $t("message.devices.emptyAddTip") }}
              </NButton>
            </template>
          </NEmpty>
        </div>
        <NGrid v-if="community.devices" :cols="4" :x-gap="12">
          <NGridItem v-for="device of community.devices">
            <DeviceCard :device="device" @deleted="getCommunities" />
          </NGridItem>
        </NGrid>
      </NListItem>
    </NList>
    <NModal v-model:show="showNewDeviceModal">
      <NewDeviceModal
        v-if="!showNewDeviceResult"
        :community="newDevicePresetCommunity!"
        @cancel="showNewDeviceModal = false"
        @added="addedDevice"
      />
      <NewDeviceResult
        v-else
        :device="newDevice!"
        @close="
          showNewDeviceModal = false;
          showNewDeviceResult = false;
        "
      />
    </NModal>
  </div>
</template>
