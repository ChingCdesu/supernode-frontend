import { createGlobalState } from "@vueuse/core";
import { ref } from "vue";
import { login } from "@/api/auth";
import { User } from "@/api/v1/users";

export const useUserState = createGlobalState(() => {
  const user = ref<User | null>(null);

  async function localLogin(username: string, password: string) {
    const { data: responseData } = await login(username, password);
    user.value = responseData.data!;
    return user.value;
  }

  return {
    user,
    localLogin,
  };
});
