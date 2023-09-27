<script lang="ts" setup>
import { NewDeviceDto } from "@/api/v1/dtos/devices";
import { Supernode } from "@/api/v1/dtos/supernode";
import { getServerInfo } from "@/api/v1/common/supernode";
import {
  NCard,
  NText,
  NButton,
  NCode,
  NInput,
  NCheckbox,
  NForm,
  NFormItem,
  NButtonGroup,
  NTooltip,
  NSpace,
  NAlert,
} from "naive-ui";
import { ref, onMounted, type Ref, computed } from "vue";
import { Icon } from "@vicons/utils";
import { Copy } from "@vicons/tabler";
import { useClipboard } from "@vueuse/core";

const props = defineProps<{
  device: NewDeviceDto;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const clipboard = useClipboard();

const serverInfo: Ref<Supernode | undefined> = ref();

const copied = ref(false);
const runInBackend = ref(false);
const secretKey = ref("");
const ipAddress = ref("");
const { hostname } = window.location;

const command = computed(() => {
  return [
    "edge",
    `-l ${hostname}:${serverInfo.value?.port}`,
    `-c ${props.device.community.name}`,
    !!serverInfo.value?.publicKey ? `-P ${serverInfo.value?.publicKey}` : "",
    !!ipAddress.value ? `-a ${ipAddress.value}` : "",
    `-I ${props.device.name}`,
    `-J ${props.device.password}`,
    `-k ${secretKey.value}`,
    "-A4",
    !runInBackend.value ? "-f" : "",
  ]
    .filter((s) => s.length > 0)
    .join(" ")
    .trim();
});

function handleCopyCommand() {
  clipboard.copy(command.value);
  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 2000);
}

onMounted(async () => {
  const response = await getServerInfo();
  serverInfo.value = response.data.data;
});
</script>

<template>
  <NCard class="w-1/2">
    <template #header>
      <NText>{{ $t("message.newDevice.deviceAdded") }}</NText>
    </template>
    <template #default>
      <NAlert type="warning" class="mb-4">
        {{ $t("message.newDevice.securityTip") }}
      </NAlert>
      <NForm label-placement="left" label-width="auto">
        <NFormItem :label="$t('message.newDevice.deviceName')">
          <NInput v-model:value="props.device.name" disabled />
        </NFormItem>
        <NFormItem
          :label="$t('message.newDevice.secret')"
          validation-status="warning"
          :feedback="$t('message.newDevice.secretTip')"
        >
          <NInput v-model:value="secretKey" spellcheck="false" />
        </NFormItem>
        <NFormItem
          :label="$t('message.newDevice.ipAddress')"
          validation-status="success"
          :feedback="$t('message.newDevice.ipAddressTip')"
        >
          <NInput v-model:value="ipAddress" spellcheck="false" />
        </NFormItem>
        <NFormItem :label="$t('message.newDevice.runInBackend')">
          <NCheckbox v-model:checked="runInBackend" />
        </NFormItem>
        <NFormItem :label="$t('message.newDevice.shellCommand')">
          <NButtonGroup>
            <NCode :code="command" inline />
            <NTooltip>
              <template #trigger>
                <NButton @click="handleCopyCommand">
                  <template #icon>
                    <Icon><Copy /></Icon>
                  </template>
                </NButton>
              </template>
              <template #default>
                {{
                  copied
                    ? $t("message.common.copied")
                    : $t("message.common.copy")
                }}
              </template>
            </NTooltip>
          </NButtonGroup>
        </NFormItem>
      </NForm>
    </template>
    <template #footer>
      <NSpace align="center" justify="end">
        <NButton secondary @click="emit('close')">
          {{ $t("message.common.close") }}
        </NButton>
      </NSpace>
    </template>
  </NCard>
</template>
