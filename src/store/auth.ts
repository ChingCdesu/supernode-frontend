import { createGlobalState, useLocalStorage } from "@vueuse/core";
import { computed } from "vue";

export const useAuthState = createGlobalState(() => {
  const tokenExpiredAt = useLocalStorage<Date | null>("tokenExpired", null, {
    serializer: {
      read(raw) {
        if (raw === "null") {
          return null;
        }
        if (raw) {
          return new Date(raw);
        }
        return null;
      },
      write(value) {
        if (value === null) {
          return "null";
        }
        return value.toISOString();
      },
    },
  });

  const isExpired = computed(
    () => !tokenExpiredAt.value || tokenExpiredAt.value < new Date()
  );

  return { tokenExpiredAt, isExpired };
});
