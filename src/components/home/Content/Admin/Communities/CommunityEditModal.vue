<script lang="ts" setup>
import { Community } from "@/api/v1/dtos/community";
import { ref } from "vue";
import {
  NCard,
  NForm,
  NButton,
  NSpace,
  NInput,
  NCheckbox,
  NFormItem,
  NText,
  FormInst,
  FormRules,
} from "naive-ui";
import {
  addCommunity,
  // updateCommunityInfo,
} from "@/api/v1/management/communities";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  community?: Community;
  isNew: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "updated", community: Community): void;
}>();

const { t } = useI18n();

const community = ref<Partial<Community>>(props.community ?? {});

const formRef = ref<FormInst | undefined>();

const rules: FormRules = {
  name: {
    required: true,
    message: t("message.common.required", {
      field: t("message.admin.community.column.name"),
    }),
    trigger: "blur",
  },
  subnet: {
    required: true,
    message: t("message.common.required", {
      field: t("message.admin.community.column.subnet"),
    }),
    trigger: "blur",
  },
};

function handleSubmit() {
  formRef.value?.validate((errors) => {
    if (errors) {
      return;
    }
    if (props.isNew) {
      handleAdd();
    } else {
      handleUpdate();
    }
  });
}

async function handleAdd() {
  const response = await addCommunity({
    name: community.value.name!,
    subnet: community.value.subnet!,
    encryption: community.value.encryption!,
  });

  emit("updated", response.data.data!);
}

function handleUpdate() {
  // updateCommunityInfo(community.value.id!, {
  //   name: community.value.name!,
  //   subnet: community.value.subnet!,
  //   encryption: community.value.encryption!,
  // });
}
</script>

<template>
  <NCard class="w-1/2">
    <template #header>
      <NText>
        {{
          props.isNew
            ? $t("message.admin.community.edit.createNewCommunity")
            : $t("message.admin.community.edit.editCommunity")
        }}
      </NText>
    </template>
    <template #default>
      <NForm
        label-placement="left"
        label-width="auto"
        ref="formRef"
        :model="community"
        :rules="rules"
      >
        <NFormItem
          :label="$t('message.admin.community.column.name')"
          required
          path="name"
        >
          <NInput v-model:value="community.name" />
        </NFormItem>
        <NFormItem
          :label="$t('message.admin.community.column.subnet')"
          required
          path="subnet"
        >
          <NInput v-model:value="community.subnet" />
        </NFormItem>
        <NFormItem
          :label="$t('message.admin.community.authority.private')"
          path="encryption"
        >
          <NCheckbox v-model:checked="community.encryption" />
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
