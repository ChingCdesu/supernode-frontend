<script lang="ts" setup>
import { NH1, NH3, NForm, NFormItem, NAnchor, NAnchorLink } from "naive-ui";
import ColorSchemaSwitch from "@/components/common/ColorSchemaSwitch.vue";
import LocaleSelector from "@/components/common/LocaleSelector.vue";
</script>

<template>
  <div class="p-8">
    <NH1>{{ $t("message.routes.settings") }}</NH1>
    <div class="flex">
      <div class="flex-1">
        <NH3 id="appearance">
          {{ $t("message.settings.appearance.$title") }}
        </NH3>
        <NForm label-placement="left" label-width="120px" label-align="right">
          <NFormItem :label="$t('message.settings.appearance.theme')">
            <ColorSchemaSwitch />
          </NFormItem>
          <NFormItem :label="$t('message.settings.appearance.locale')">
            <LocaleSelector />
          </NFormItem>
        </NForm>
      </div>
      <NAnchor>
        <NAnchorLink
          :title="$t('message.settings.appearance.$title')"
          href="#appearance"
        />
      </NAnchor>
    </div>
  </div>
</template>
