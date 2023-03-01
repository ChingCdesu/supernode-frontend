<script setup lang="ts">
import {
  NMessageProvider,
  NNotificationProvider,
  NConfigProvider,
  NDialogProvider,
  NLoadingBarProvider,
  NGlobalStyle,
  lightTheme,
  darkTheme,
} from "naive-ui";
import { useDark } from "@vueuse/core";
import { useLocaleState } from "@/store/locale";

const isDark = useDark();
const { locale, dateLocale } = useLocaleState();
</script>

<template>
  <NConfigProvider
    :theme="isDark ? darkTheme : lightTheme"
    :locale="locale"
    :date-locale="dateLocale"
  >
    <NGlobalStyle />
    <NDialogProvider>
      <NNotificationProvider>
        <NMessageProvider>
          <NLoadingBarProvider>
            <router-view />
          </NLoadingBarProvider>
        </NMessageProvider>
      </NNotificationProvider>
    </NDialogProvider>
  </NConfigProvider>
</template>
