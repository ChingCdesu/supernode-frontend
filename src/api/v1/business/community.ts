import * as request from "@/utils/request";

import { Community } from "@/api/v1/dtos/community";

export function listCommunities(
  pagination?: Partial<request.PaginationParams>
) {
  return request.Get<request.PaginationResponse<Community>>(
    "/v1/communities",
    pagination
  );
}

export function getCommunityById(communityId: number) {
  return request.Get<Community>(`/v1/communities/${communityId}}`);
}
