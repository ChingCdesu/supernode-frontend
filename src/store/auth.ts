import { createGlobalState } from "@vueuse/core";
import { ref, computed } from "vue";

export const useAuthState = createGlobalState(() => {
  const tokenExpiredAt = ref<Date | null>(null);

  const isLogin = computed(() => !!tokenExpiredAt.value);

  return { tokenExpiredAt, isLogin };
});
