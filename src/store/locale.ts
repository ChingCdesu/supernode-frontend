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
import { useI18n } from "vue-i18n";

export type Language = "zh-CN" | "zh-TW" | "en-US" | "ja-JP";

const localeMap: Record<Language, [NLocale, NDateLocale]> = {
  "zh-CN": [zhCN, dateZhCN],
  "zh-TW": [zhTW, dateZhTW],
  "en-US": [enUS, dateEnUS],
  "ja-JP": [jaJP, dateJaJP],
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

  function changeLocale(lang: Language) {
    if (!Object.keys(localeMap).includes(lang)) {
      throw new Error(`Language ${lang} is not supported.`);
    }
    const i18n = useI18n();
    language.value = lang;
    i18n.locale.value = lang;
  }

  return {
    language,
    locale,
    dateLocale,
    changeLocale,
  };
});
