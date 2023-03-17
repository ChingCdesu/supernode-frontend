import { createI18n } from "vue-i18n";
import { useLocaleState } from "@/store/locale";

import zhCN from './locales/zh-cn.yaml';
import enUS from './locales/en-us.yaml';

const { language } = useLocaleState();

const i18n = createI18n({
  legacy: false,
  locale: language.value,
  allowComposition: true,
  messages: {
    "zh-CN": zhCN,
    "en-US": enUS,
  }
});

export default i18n;