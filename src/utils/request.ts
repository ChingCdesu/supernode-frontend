import {
  createDiscreteApi,
  ConfigProviderProps,
  darkTheme,
  lightTheme,
} from "naive-ui";
import axios, { AxiosError, AxiosResponse } from "axios";
import { computed } from "vue";
import { useDark, useOnline } from "@vueuse/core";
import { useI18n } from "vue-i18n";
import { add as addDate } from "date-fns";

import { useAuthState } from "@/store/auth";

export interface ApiResponse<T = any> {
  code?: number;
  message: string;
  data?: T;
}

export interface PaginationParams {
  page: number;
  limit: number;
  order: "asc" | "desc";
}

export interface PaginationResponse<T = any> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    itemCount: number;
    pageCount: number;
    hasPerviousPage: boolean;
    hasNextPage: boolean;
  };
}

const isDark = useDark();
const isOnline = useOnline();
const { t } = useI18n();
const { tokenExpiredAt } = useAuthState();
const config = computed<ConfigProviderProps>(() => {
  return { theme: isDark ? darkTheme : lightTheme };
});

const { CancelToken } = axios;

const { message } = createDiscreteApi(["message"], {
  configProviderProps: config,
});

const request = axios.create({
  baseURL: "/api",
  timeout: 5000,
});

request.interceptors.request.use((config) => {
  if (!isOnline.value) {
    const source = CancelToken.source();
    config.cancelToken = source.token;
    message.error(t("message.tips.networkOffline"));
    source.cancel();
  }
  return config;
});

request.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { data: responseData } = response;
    if (responseData.code !== 0) {
      message.error(
        t("message.tips.requestError", { message: responseData.message })
      );
    }
    if (response.headers["X-Authenticated"] /* Authenticated */) {
      const responseDate = new Date(response.headers["Date"]);
      tokenExpiredAt.value = addDate(responseDate, {
        hours: 1,
      });
    } else {
      tokenExpiredAt.value = null;
    }
    return response;
  },
  (error: AxiosError<ApiResponse>) => {
    const { response } = error;
    if (response) {
      message.error(
        t("message.tips.requestError", { message: response.data.message })
      );
    } else {
      message.error(t("message.tips.unknownNetworkError"));
    }
    return Promise.reject(error);
  }
);

export async function Get<T = any, P = any>(
  url: string,
  params?: P
): Promise<AxiosResponse<ApiResponse<T>>> {
  return await request.get(url, { params });
}

export async function Post<T = any, D = any, P = any>(
  url: string,
  params?: P,
  data?: D
): Promise<AxiosResponse<ApiResponse<T>>> {
  return await request.post(url, data, { params });
}

export async function Put<T = any, D = any, P = any>(
  url: string,
  params?: P,
  data?: D
): Promise<AxiosResponse<ApiResponse<T>>> {
  return await request.put(url, data, { params });
}

export async function Patch<T = any, D = any, P = any>(
  url: string,
  params?: P,
  data?: D
): Promise<AxiosResponse<ApiResponse<T>>> {
  return await request.patch(url, data, { params });
}

export async function Delete<T = any, P = any>(
  url: string,
  params?: P
): Promise<AxiosResponse<ApiResponse<T>>> {
  return await request.delete(url, { params });
}
