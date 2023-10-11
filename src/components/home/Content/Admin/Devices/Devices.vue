<script lang="ts" setup>
import {
  DataTableColumns,
  NDataTable,
  NTag,
  NTime,
  NButton,
  NSpace,
  NModal,
  NSelect,
  useDialog,
  NText,
  useMessage,
} from "naive-ui";
import { h, ref, onMounted, type Ref, reactive, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { type PartialDeep } from "type-fest";
import {
  listDevices,
  addDevice,
  updateDeviceInfo,
  deleteDevice,
} from "@/api/v1/management/devices";
import { listCommunities } from "@/api/v1/management/communities";
import { Icon } from "@vicons/utils";
import { Edit, Trash, Refresh, Plus } from "@vicons/tabler";

import DeviceEditModal from "@/components/common/DeviceEditModal.vue";
import { Community } from "@/api/v1/dtos/community";
import {
  Device,
  ManagementCreateDeviceDto,
  ManagementUpdateDeviceDto,
} from "@/api/v1/dtos/devices";

const { t } = useI18n();
const dialog = useDialog();
const message = useMessage();

const communities: Ref<Community[]> = ref([]);
const selectedCommunityId = ref<number | undefined>();
const selectedCommunity = computed(() => {
  return communities.value.find((c) => c.id === selectedCommunityId.value);
});
const devices: Ref<Device[]> = ref([]);
const showEditModal = ref(false);
const editIsNew = ref(false);
const editingDevice: Ref<Device | undefined> = ref();

const pagination = reactive({
  page: 1,
  pageSize: 10,
  itemCount: 0,
  showSizePicker: true,
  pageSizes: [5, 10, 20],
  onChange(page: number) {
    pagination.page = page;
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize;
    pagination.page = 1;
  },
});

const communityOptions = computed(() => {
  return communities.value.map((c) => ({
    label: c.name,
    value: c.id,
  }));
});

const columns: DataTableColumns<Device> = [
  {
    title: t("message.devices.column.name"),
    key: "name",
  },
  {
    title: t("message.devices.column.status"),
    key: "isOnline",
    render(row) {
      return h(
        NTag,
        {
          type: row.isOnline ? "success" : undefined,
        },
        () =>
          t(
            `message.admin.device.status.${row.isOnline ? "online" : "offline"}`
          )
      );
    },
  },
  {
    title: t("message.devices.column.owner"),
    key: "owner",
    render(row) {
      return row.owner?.name ?? "-";
    },
  },
  {
    title: t("message.devices.column.mac"),
    key: "mac",
    render(row) {
      return row.mac?.toUpperCase() ?? "-";
    },
  },
  {
    title: t("message.devices.column.ip"),
    key: "ip",
    render(row) {
      return row.ip ?? "-";
    },
  },
  {
    title: t("message.devices.column.createdAt"),
    key: "createdAt",
    render(row) {
      return h(NTime, {
        time: new Date(row.createdAt),
      });
    },
  },
  {
    title: t("message.devices.column.updatedAt"),
    key: "updatedAt",
    render(row) {
      return h(NTime, {
        time: new Date(row.updatedAt),
      });
    },
  },
  {
    title: t("message.devices.column.action"),
    key: "actions",
    render(row) {
      return h(NSpace, () => [
        h(
          NButton,
          {
            type: "warning",
            secondary: true,
            onClick() {
              handleEdit(row);
            },
          },
          () => h(Icon, () => h(Edit))
        ),
        h(
          NButton,
          {
            type: "error",
            secondary: true,
            onClick() {
              handleRemove(row);
            },
          },
          () => h(Icon, () => h(Trash))
        ),
      ]);
    },
  },
];

async function getCommunities() {
  let hasNextPage = true;
  let page = 1;
  communities.value.splice(0);
  while (hasNextPage) {
    const res = await listCommunities({
      page,
    });
    const arr = res.data.data?.data.filter((c) => c.encryption) ?? [];
    communities.value.push(...arr);

    hasNextPage = res.data.data?.meta.hasNextPage ?? false;
    page++;
  }

  communities.value.sort((a, b) => a.id - b.id);
}

async function getDevices() {
  if (!selectedCommunityId.value) {
    return;
  }

  const res = await listDevices(selectedCommunityId.value, {
    page: pagination.page,
    limit: pagination.pageSize,
  });
  devices.value = res.data.data?.data ?? [];
  pagination.itemCount = res.data.data?.meta.itemCount ?? 0;
}

function handleEdit(device: Device) {
  editIsNew.value = false;
  editingDevice.value = device;
  showEditModal.value = true;
}

function handleRemove(device: Device) {
  if (!selectedCommunityId.value) {
    return;
  }
  dialog.error({
    title: t("message.admin.device.remove.confirm"),
    content: t("message.admin.device.remove.confirmTip"),
    positiveText: t("message.common.confirm"),
    negativeText: t("message.common.cancel"),
    onPositiveClick() {
      deleteDevice(selectedCommunityId.value!, device.id).then(getDevices);
    },
  });
}

function handleAdd() {
  if (!selectedCommunityId.value) {
    message.error(t("message.admin.device.selectCommunityTip"));
    return;
  }
  editingDevice.value = undefined;
  showEditModal.value = true;
}

async function handleSubmit(community: Community, device: PartialDeep<Device>) {
  if (editIsNew.value) {
    const dto: ManagementCreateDeviceDto = {
      name: device.name!,
      publicKey: device.publicKey!,
      communityId: community.id,
      ownerId: device.owner!.id!,
    };
    await addDevice(community.id, dto);
  } else {
    const dto: ManagementUpdateDeviceDto = {
      name: device.name!,
      publicKey: device.publicKey!,
      communityId: community.id,
      ownerId: device.owner!.id,
    };
    await updateDeviceInfo(community.id, device.id!, dto);
  }
  showEditModal.value = false;
  getDevices();
}

onMounted(() => {
  getCommunities().then(() => {
    if (communities.value.length > 0) {
      selectedCommunityId.value = communities.value[0].id;
    }
  });
});

watch(selectedCommunityId, getDevices);
</script>

<template>
  <div class="p-4">
    <NSpace justify="space-between" align="center" class="mb-4">
      <NSpace justify="start" align="center">
        <NText> {{ $t("message.admin.device.selectCommunity") }}</NText>
        <NSelect
          class="w-64"
          v-model:value="selectedCommunityId"
          :options="communityOptions"
        />
      </NSpace>
      <NSpace justify="end" align="center">
        <NButton quaternary circle @click="handleAdd">
          <template #icon>
            <Plus />
          </template>
        </NButton>
        <NButton quaternary circle @click="getDevices">
          <template #icon>
            <Refresh />
          </template>
        </NButton>
      </NSpace>
    </NSpace>
    <NDataTable :columns="columns" :data="devices" :pagination="pagination" />
    <NModal v-model:show="showEditModal">
      <DeviceEditModal
        with-owner-select
        :community="selectedCommunity"
        :device="editingDevice"
        @close="showEditModal = false"
        @finished="handleSubmit"
      />
    </NModal>
  </div>
</template>
