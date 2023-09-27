<script lang="ts" setup>
import { Community } from "@/api/v1/dtos/community";
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
import { listCommunities } from "@/api/v1/management/communities";
import { Icon } from "@vicons/utils";
import { Edit, Trash, Refresh, Plus } from "@vicons/tabler";

import CommunityEditModal from "./CommunityEditModal.vue";

const { t } = useI18n();

const communities: Ref<Community[]> = ref([]);
const showEditModal = ref(false);
const editIsNew = ref(false);
const editingCommunity: Ref<Community | undefined> = ref();

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

const columns: DataTableColumns<Community> = [
  {
    title: t("message.admin.community.column.name"),
    key: "name",
  },
  {
    title: t("message.admin.community.column.subnet"),
    key: "subnet",
  },
  {
    title: t("message.admin.community.column.authority"),
    key: "encryption",
    render(row) {
      return h(
        NTag,
        {
          type: row.encryption ? "warning" : "success",
        },
        () =>
          t(
            `message.admin.community.authority.${
              row.encryption ? "private" : "public"
            }`
          )
      );
    },
  },
  {
    title: t("message.admin.community.column.onlineDeviceCount"),
    key: "onlineUserCount",
  },
  {
    title: t("message.admin.community.column.totalDeviceCount"),
    key: "totalUserCount",
  },
  {
    title: t("message.admin.community.column.createdAt"),
    key: "createdAt",
    render(row) {
      return h(NTime, {
        time: new Date(row.createdAt),
      });
    },
  },
  {
    title: t("message.admin.community.column.updatedAt"),
    key: "updatedAt",
    render(row) {
      return h(NTime, {
        time: new Date(row.updatedAt),
      });
    },
  },
  {
    title: t("message.admin.community.column.action"),
    key: "actions",
    render(row) {
      return h(NSpace, () => [
        // () => h(
        //   NButton,
        //   {
        //     type: "warning",
        //     secondary: true,
        //     onClick() {
        //       handleEdit(row);
        //     },
        //   },
        //   () => h(Icon, () => h(Edit)),
        // ),
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

function handleEdit(community: Community) {}

function handleRemove(community: Community) {}

function handleAdd() {
  editIsNew.value = true;
  editingCommunity.value = undefined;
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
      <CommunityEditModal
        :is-new="editIsNew"
        :community="editingCommunity"
        @close="showEditModal = false"
        @updated="
          showEditModal = false;
          getCommunities();
        "
      />
    </NModal>
  </div>
</template>
