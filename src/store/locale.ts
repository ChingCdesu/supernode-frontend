import { ref, computed, Ref } from "vue";
import { createGlobalState } from "@vueuse/core";
import {
  zhCN,
  zhTW,
  enUS,
  jaJP,
  dateZhCN,
  dateZhTW,
  dateEnUS,
  dateJaJP,
} from "naive-ui";
import type { NLocale, NDateLocale } from "naive-ui";

export type Language = "zh-CN" | "zh-TW" | "en-US" | "ja-JP";

export const localeMap: Record<Language, [NLocale, NDateLocale, string]> = {
  "zh-CN": [zhCN, dateZhCN, "简体中文"],
  "zh-TW": [zhTW, dateZhTW, "繁體中文"],
  "en-US": [enUS, dateEnUS, "English"],
  "ja-JP": [jaJP, dateJaJP, "日本語"],
};

const fallbackLocale = "en-US";

function getLanguage(): Language {
  const locale = navigator.language;
  return Object.keys(localeMap).includes(locale)
    ? (locale as Language)
    : fallbackLocale;
}

export const useLocaleState = createGlobalState(() => {
  const language: Ref<Language> = ref(getLanguage());

  const locale = computed(() => localeMap[language.value][0]);

  const dateLocale = computed(() => localeMap[language.value][1]);

  const displayLocale = computed(() => localeMap[language.value][2]);

  function changeLocale(lang: Language) {
    if (!Object.keys(localeMap).includes(lang)) {
      throw new Error(`Language ${lang} is not supported.`);
    }
    language.value = lang;
  }

  return {
    language,
    locale,
    dateLocale,
    changeLocale,
    displayLocale,
  };
});
