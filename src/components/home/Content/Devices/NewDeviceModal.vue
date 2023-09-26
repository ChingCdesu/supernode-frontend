<script lang="ts" setup>
import type { Community } from "@/api/v1/dtos/community";
import {
  NCard,
  NForm,
  NFormItem,
  NText,
  NSelect,
  NSpace,
  NCollapse,
  NCollapseItem,
  NInput,
  NButton,
  type FormInst,
  FormRules,
} from "naive-ui";
import { useI18n } from "vue-i18n";

import { onMounted, ref, computed, type Ref } from "vue";
import { listCommunities } from "@/api/v1/business/community";
import { addDevice } from "@/api/v1/business/devices";
import { generate_user_token } from "@/utils/crypto";
import { NewDeviceDto } from "@/api/v1/dtos/devices";

const props = defineProps<{
  community: Community;
}>();

const emit = defineEmits<{
  (e: 'added', device: NewDeviceDto): void
  (e: 'cancel'): void
}>();

const { t } = useI18n();

const allCommunities: Ref<Community[]> = ref([]);

const formRef = ref<FormInst | null>(null);

const device = ref({
  name: "",
  communityId: props.community.id,
  password: "",
});

const rules: FormRules = {
  name: {
    required: true,
    message: t("message.common.required", {
      field: t("message.newDevice.deviceName"),
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
  },
  password: {
    required: true,
    message: t("message.common.required", {
      field: t("message.newDevice.password"),
    }),
    trigger: "blur",
  },
};

const communitySelectOptions = computed(() =>
  allCommunities.value.map((c) => ({ label: c.name, value: c.id }))
);

async function getCommunities() {
  let page = 1;
  let stop = false;
  const communities: Community[] = [];

  while (!stop) {
    try {
      const res = await listCommunities({ page, limit: 100 });
      const arr = res.data.data?.data ?? [];
      communities.push(...arr);
      page += 1;
      if (!!!res.data.data?.meta.hasNextPage) {
        stop = true;
      }
    } catch (err) {
      console.error(err);
      stop = true;
    }
  }
  allCommunities.value = communities;
}

function newDevice() {
  formRef.value?.validate(async (errors) => {
    if (errors) {
      return;
    }

    await addDevice({
      name: device.value.name,
      communityId: device.value.communityId!,
      publicKey: await generate_user_token(
        device.value.name,
        device.value.password
      ),
    });

    emit("added", device.value);
  });
}

onMounted(getCommunities);
</script>

<template>
  <NCard class="w-1/2">
    <template #header>
      <NText>{{ $t("message.newDevice.addNewDevice") }}</NText>
    </template>
    <template #default>
      <NForm ref="formRef" :model="device" :rules="rules">
        <NFormItem :label="t('message.common.community')" path="communityId">
          <NSelect
            filterable
            :placeholder="t('message.newDevice.selectCommunity')"
            :options="communitySelectOptions"
            :default-value="props.community?.id"
            v-model:value="device.communityId"
          />
        </NFormItem>
        <NFormItem :label="t('message.newDevice.deviceName')" path="name">
          <NInput v-model:value="device.name" />
        </NFormItem>
        <!-- <NCollapse>
          <NCollapseItem>
            <template #header>
              <NText>{{ $t('message.newDevice.advanced') }}</NText>
            </template>
            <template #default> -->
        <NFormItem :label="t('message.newDevice.password')" path="password">
          <NInput
            type="password"
            v-model:value="device.password"
            show-password-on="click"
          />
        </NFormItem>
        <!-- </template>
          </NCollapseItem>
        </NCollapse> -->
      </NForm>
    </template>
    <template #footer>
      <NSpace justify="end" align="center">
        <NButton secondary @click="$emit('cancel')">{{ $t("message.common.cancel") }}</NButton>
        <NButton type="primary" @click="newDevice">
          {{ $t("message.newDevice.add") }}
        </NButton>
      </NSpace>
    </template>
  </NCard>
</template>
