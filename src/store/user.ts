import { createGlobalState } from "@vueuse/core";
import { ref } from "vue";

export interface UserState {
  userId?: number;
  username?: string;
}

export const useUserState = createGlobalState(() => {
  const user = ref<UserState>({});

  async function localLogin(username: string, password: string) {}

  return {
    user,
  };
});
