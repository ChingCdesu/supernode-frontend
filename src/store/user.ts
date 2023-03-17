import { ref } from "vue";
import { createGlobalState } from "@vueuse/core";

export const useUserState = createGlobalState(() => {
  const user = ref(null);

  return {
    user,
  };
});
