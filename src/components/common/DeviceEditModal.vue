<script lang="ts" setup>
import { Community } from "@/api/v1/dtos/community";
import { Device } from "@/api/v1/dtos/devices";
import { computed, onMounted, ref } from "vue";
import { type PartialDeep } from "type-fest";
import {
  NCard,
  NForm,
  NButton,
  NSpace,
  NInput,
  NSelect,
  NFormItem,
  NText,
  FormInst,
  FormRules,
} from "naive-ui";

import { useI18n } from "vue-i18n";
import { listCommunities } from "@/api/v1/business/community";
import { generate_user_token } from "@/utils/crypto";
import { listUsers } from "@/api/v1/business/users";
import { User } from "@/api/v1/dtos/users";

const props = defineProps<{
  community?: Community;
  device?: Device;
  withOwnerSelect?: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "finished", community: Community, device: PartialDeep<Device>): void;
}>();

const { t } = useI18n();

const isNew = computed(() => !props.device);

const device = ref<PartialDeep<Device & { password: string }>>(
  props.device ?? {}
);
const communities = ref<Community[]>([]);
const selectedCommunityId = ref<number | undefined>(props.community?.id);
const selectedCommunity = computed(() => {
  return communities.value.find((c) => c.id === selectedCommunityId.value);
});
const communityOptions = computed(() => {
  return communities.value.map((c) => ({
    label: c.name,
    value: c.id,
  }));
});
const users = ref<User[]>([]);
const userOptions = computed(() => {
  return users.value.map((u) => ({
    label: u.name,
    value: u.id,
  }));
});

const formRef = ref<FormInst | undefined>();

const rules: FormRules = {
  name: {
    required: true,
    message: t("message.common.required", {
      field: t("message.devices.column.name"),
    }),
    trigger: "blur",
  },
  communityId: {
    required: true,
    type: "number",
    message: t("message.common.required", {
      field: t("message.common.community"),
    }),
    trigger: "blur",
    validator: () => !!selectedCommunityId.value,
  },
  password: {
    required: true,
    message: t("message.common.required", {
      field: t("message.devices.column.password"),
    }),
    trigger: "blur",
  },
  ownerId: {
    required: props.withOwnerSelect,
    type: "number",
    message: t("message.common.required", {
      field: t("message.devices.column.owner"),
    }),
    validator: () => !!device.value.owner?.id,
  },
};

function handleSubmit() {
  formRef.value?.validate((errors) => {
    if (errors) {
      return;
    }
    handleFinish();
  });
}

async function handleFinish() {
  device.value.publicKey = await generate_user_token(
    device.value.name!,
    device.value.password!
  );
  delete device.value.password;
  emit("finished", selectedCommunity.value!, device.value);
}

async function getCommunities() {
  let page = 1;
  let stop = false;
  const result: Community[] = [];

  while (!stop) {
    try {
      const res = await listCommunities({ page, limit: 100 });
      const arr = res.data.data?.data.filter((c) => c.encryption) ?? [];
      result.push(...arr);
      if (res.data.data?.meta.hasNextPage) {
        page++;
      } else {
        stop = true;
      }
    } catch (e) {
      console.error(e);
      stop = true;
    }
  }

  result.sort((a, b) => a.id - b.id);
  communities.value = result;
}

async function getUsers() {
  let page = 1;
  let stop = false;
  const result: User[] = [];

  while (!stop) {
    try {
      const res = await listUsers({ page, limit: 100 });
      const arr = res.data.data?.data ?? [];
      result.push(...arr);
      if (res.data.data?.meta.hasNextPage) {
        page++;
      } else {
        stop = true;
      }
    } catch (e) {
      console.error(e);
      stop = true;
    }
  }

  result.sort((a, b) => a.id - b.id);
  users.value = result;
}

onMounted(async () => {
  await getCommunities();
  if (props.withOwnerSelect) {
    await getUsers();
  }
});
</script>

<template>
  <NCard class="w-1/2">
    <template #header>
      <NText>
        {{
          isNew
            ? $t("message.editDeviceModal.addNewDevice")
            : $t("message.editDeviceModal.editDevice")
        }}
      </NText>
    </template>
    <template #default>
      <NForm
        label-placement="left"
        label-width="auto"
        ref="formRef"
        :model="device"
        :rules="rules"
      >
        <NFormItem :label="t('message.common.community')" path="communityId">
          <NSelect
            filterable
            :placeholder="t('message.newDevice.selectCommunity')"
            :options="communityOptions"
            v-model:value="selectedCommunityId"
          />
        </NFormItem>
        <NFormItem
          v-if="props.withOwnerSelect"
          :label="t('message.devices.column.owner')"
          path="ownerId"
        >
          <NSelect
            :default-value="device.owner?.id"
            :options="userOptions"
            :placeholder="t('message.devices.column.owner')"
            @update:value="(value: number) => device.owner = users.find(u => u.id === value)!"
          />
        </NFormItem>
        <NFormItem :label="t('message.newDevice.deviceName')" path="name">
          <NInput v-model:value="device.name" />
        </NFormItem>
        <NFormItem :label="t('message.newDevice.password')" path="password">
          <NInput
            type="password"
            v-model:value="device.password"
            show-password-on="click"
          />
        </NFormItem>
      </NForm>
    </template>
    <template #footer>
      <NSpace align="center" justify="end">
        <NButton type="primary" @click="handleSubmit">
          {{
            isNew ? $t("message.common.create") : $t("message.common.update")
          }}
        </NButton>
        <NButton @click="emit('close')">
          {{ $t("message.common.cancel") }}
        </NButton>
      </NSpace>
    </template>
  </NCard>
</template>
