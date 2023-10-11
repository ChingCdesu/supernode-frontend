<script lang="ts" setup>
import {
  listUsers,
  addUser,
  deleteUser,
  updateUserInfo,
} from "@/api/v1/business/users";
import { User } from "@/api/v1/dtos/users";
import { Edit, Trash } from "@vicons/tabler";
import { Icon } from "@vicons/utils";
import { DataTableColumns, NButton, NDataTable, NSpace, NTag } from "naive-ui";
import { h, onMounted, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const users = ref<User[]>([]);

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

const columns: DataTableColumns<User> = [
  {
    title: t("message.admin.user.column.name"),
    key: "name",
  },
  {
    title: t("message.admin.user.column.email"),
    key: "email",
  },
  {
    title: t("message.admin.user.column.role"),
    key: "isAdmin",
    render(row) {
      return h(
        NTag,
        {
          type: row.isAdmin ? "success" : undefined,
        },
        () => t(`message.admin.user.role.${row.isAdmin ? "admin" : "user"}`)
      );
    },
  },
  {
    title: t("message.admin.user.column.issuer"),
    key: "issuer",
  },
  {
    title: t("message.admin.user.column.actions"),
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
  }
];

async function getUsers() {
  const { data } = await listUsers({
    page: pagination.page,
    limit: pagination.pageSize,
  });
  users.value = data.data?.data ?? [];
  pagination.itemCount = data.data?.meta.itemCount ?? 0;
}

async function handleAdd(user: User) {

}

async function handleEdit(user: User) {
  
}

async function handleRemove(user: User) {
  
}

onMounted(getUsers);
</script>

<template>
  <div class="p-4">
    <NDataTable :columns="columns" :data="users" :pagination="pagination" />
  </div>
</template>
