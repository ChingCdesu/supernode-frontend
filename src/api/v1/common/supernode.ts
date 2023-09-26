import * as request from "@/utils/request";

import { Supernode } from "@/api/v1/dtos/supernode";

export function getServerInfo() {
  return request.Get<Supernode>("/v1/supernode");
}
