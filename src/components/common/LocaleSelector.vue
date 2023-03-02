<script lang="ts" setup>
import { NPopselect, NButton } from "naive-ui";
import { Icon } from "@vicons/utils";
import { Language } from "@vicons/tabler";
import _ from "lodash";
import { useI18n } from "vue-i18n";

import {
  useLocaleState,
  localeMap,
  Language as AvaliableLanguage,
} from "@/store/locale";

const {
  displayLocale,
  language,
  changeLocale: changeLocaleState,
} = useLocaleState();

const i18n = useI18n();

const options = Object.entries(_.mapValues(localeMap, "2")).map(
  ([value, label]) => ({ label, value })
);

function changeLocale(lang: AvaliableLanguage) {
  i18n.locale.value = lang;
  changeLocaleState(lang);
}
</script>

<template>
  <NPopselect
    trigger="hover"
    placement="bottom-start"
    :value="language"
    size="large"
    :options="options"
    @update:value="changeLocale"
  >
    <NButton round style="width: 10em">
      <template #icon>
        <Icon>
          <Language />
        </Icon>
      </template>
      {{ displayLocale }}
    </NButton>
  </NPopselect>
</template>
