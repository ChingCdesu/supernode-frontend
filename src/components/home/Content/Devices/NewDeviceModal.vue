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
} from "naive-ui";
import { useI18n } from "vue-i18n";

import { onMounted, ref, computed, type Ref } from "vue";
import { listCommunities } from "@/api/v1/business/community";

const props = defineProps<{
  community?: Community;
}>();

const { t } = useI18n();

const allCommunities: Ref<Community[]> = ref([]);

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

onMounted(getCommunities);
</script>

<template>
  <NCard class="w-1/2">
    <template #header>
      <NText>{{ $t("message.newDevice.addNewDevice") }}</NText>
    </template>
    <template #default>
      <NForm>
        <NFormItem :label="t('message.common.community')">
          <NSelect
            filterable
            :placeholder="t('message.newDevice.selectCommunity')"
            :options="communitySelectOptions"
            :defaultValue="props.community?.id"
          />
        </NFormItem>
        <NFormItem :label="t('message.newDevice.deviceName')">
          <NInput />
        </NFormItem>
        <NCollapse>
          <NCollapseItem>
            <template #header>
              <NText>{{ $t('message.newDevice.advanced') }}</NText>
            </template>
            <template #default>
              <NFormItem :label="t('message.newDevice.publicKey')">
                <NInput />
              </NFormItem>
            </template>
          </NCollapseItem>
        </NCollapse>
      </NForm>
    </template>
    <template #footer>
      <NSpace justify="end" align="center">
        <NButton secondary> {{ $t('message.common.cancel') }}</NButton>
        <NButton type="primary">{{ $t('message.newDevice.add') }}</NButton>
      </NSpace>
    </template>
  </NCard>
</template>
