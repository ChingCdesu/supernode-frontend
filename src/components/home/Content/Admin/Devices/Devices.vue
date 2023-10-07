<script lang="ts" setup>
import { Device } from "@/api/v1/dtos/devices";
import {
  DataTableColumns,
  NDataTable,
  NTag,
  NTime,
  NButton,
  NSpace,
  NModal,
  useDialog,
} from "naive-ui";
import { h, ref, onMounted, type Ref, reactive } from "vue";
import { useI18n } from "vue-i18n";
import { listDevices, deleteDevice } from "@/api/v1/management/devices";
import { listCommunities } from "@/api/v1/management/communities";
import { Icon } from "@vicons/utils";
import { Edit, Trash, Refresh, Plus } from "@vicons/tabler";

import DeviceEditModal from "./DeviceEditModal.vue";

const { t } = useI18n();
const dialog = useDialog();

const communities: Ref<Device[]> = ref([]);
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

const columns: DataTableColumns<Device> = [
  {
    title: t("message.admin.device.column.name"),
    key: "name",
  },
  {
    title: t("message.admin.device.column.status"),
    key: "isOnline",
    render(row) {
      return h(
        NTag,
        {
          type: row.isOnline ? "success" : "error",
        },
        () => t(`message.admin.device.status.${row.isOnline ? "online" : "offline"}`)
      );
    }
  },
  {
    title: t("message.admin.device.column.community"),
    key: "community",
    render(row) {
      return row.community.name;
    },
  },
  {
    title: t("message.admin.device.column.mac"),
    key: "mac",
    render(row) {
      return row.mac?.toUpperCase() ?? '-';
    },
  },
  {
    title: t("message.admin.device.column.ip"),
    key: "ip",
    render(row) {
      return row.ip ?? '-';
    },
  },
  {
    title: t("message.admin.device.column.createdAt"),
    key: "createdAt",
    render(row) {
      return h(NTime, {
        time: new Date(row.createdAt),
      });
    },
  },
  {
    title: t("message.admin.device.column.updatedAt"),
    key: "updatedAt",
    render(row) {
      return h(NTime, {
        time: new Date(row.updatedAt),
      });
    },
  },
  {
    title: t("message.admin.device.column.action"),
    key: "actions",
    render(row) {
      return h(NSpace, () => [
        () => h(
          NButton,
          {
            type: "warning",
            secondary: true,
            onClick() {
              handleEdit(row);
            },
          },
          () => h(Icon, () => h(Edit)),
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
  const res = await listCommunities({
    page: pagination.page,
    limit: pagination.pageSize,
  });
  communities.value = res.data.data?.data ?? [];
  pagination.itemCount = res.data.data?.meta.itemCount ?? 0;
}

function handleEdit(device: Device) {}

function handleRemove(device: Device) {
  dialog.warning({
    title: t("message.admin.device.remove.confirm"),
    content: t("message.admin.device.remove.confirmTip"),
    positiveText: t("message.common.confirm"),
    negativeText: t("message.common.cancel"),
    onPositiveClick() {
      deleteDevice(device.id).then(getCommunities);
    },
  });
}

function handleAdd() {
  editIsNew.value = true;
  editingDevice.value = undefined;
  showEditModal.value = true;
}

onMounted(getCommunities);
</script>

<template>
  <div class="p-4">
    <NSpace justify="end" align="center" class="mb-4">
      <NButton quaternary circle @click="handleAdd">
        <template #icon>
          <Plus />
        </template>
      </NButton>
      <NButton quaternary circle @click="getCommunities">
        <template #icon>
          <Refresh />
        </template>
      </NButton>
    </NSpace>
    <NDataTable
      :columns="columns"
      :data="communities"
      :pagination="pagination"
    />
    <NModal v-model:show="showEditModal">
      <DeviceEditModal
        :is-new="editIsNew"
        :device="editingDevice"
        @close="showEditModal = false"
        @updated="
          showEditModal = false;
          getCommunities();
        "
      />
    </NModal>
  </div>
</template>
