import { createGlobalState } from "@vueuse/core";
import { ref } from "vue";
import * as AuthApi from "@/api/auth";
import * as UserApi from "@/api/v1/business/users";
import { User as UserModel } from "@/api/v1/dtos/users";

export const useUserState = createGlobalState(() => {
  const user = ref<UserModel | null>(null);

  async function localLogin(username: string, password: string) {
    const { data: responseData } = await AuthApi.localLogin(username, password);
    user.value = responseData.data!;
    return user.value;
  }

  async function getMe() {
    const { data: responseData } = await UserApi.getMe();
    user.value = responseData.data!;
    return user.value;
  }

  return {
    user,
    localLogin,
    getMe,
  };
});
