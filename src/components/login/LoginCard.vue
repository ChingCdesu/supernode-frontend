<script lang="ts" setup>
import { NSpace, NCard, useMessage, NInput, NButton } from "naive-ui";
import { Icon } from "@vicons/utils";
import { UserCircle, Lock } from "@vicons/tabler";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const message = useMessage();

function localLogin() {
  message.info(t("message.tips.developing"));
}

function oidcLogin() {
  window.location.href = "/api/auth/oidc";
}
</script>

<template>
  <div class="container">
    <NCard
      class="login-card"
      :bordered="false"
      :title="$t('message.common.welcomeback')"
    >
      <NSpace vertical>
        <div class="input-row">
          <Icon size="24">
            <UserCircle />
          </Icon>
          <NInput :placeholder="$t('message.common.username')" />
        </div>
        <div class="input-row">
          <Icon size="24">
            <Lock />
          </Icon>
          <NInput
            type="password"
            show-password-on="click"
            :placeholder="$t('message.common.passcode')"
          />
        </div>
      </NSpace>

      <template #action>
        <div class="login-actions">
          <NButton @click="localLogin">{{
            $t("message.common.login")
          }}</NButton>
          <NButton class="oidc-login" text @click="oidcLogin">
            Login with OIDC
          </NButton>
        </div>
      </template>
    </NCard>
  </div>
</template>

<style lang="less" scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
}

.login-card {
  text-align: center;
  background-color: transparent;
  & :deep(.n-card__action) {
    background-color: transparent;
  }
}

.input-row {
  display: flex;
  align-items: center;
  & > :deep(.xicon) {
    margin-right: 4px;
  }
}

.login-actions {
  display: flex;
  flex-direction: column;
  & > * {
    margin-bottom: 1em;
  }
}

.oidc-login {
  justify-self: center;
}
</style>
