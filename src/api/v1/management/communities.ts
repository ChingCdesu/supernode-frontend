import * as request from "@/utils/request";

import {
  Community,
  CreateCommunityDto,
  TransferCommunityDto,
  UpdateCommunityDto,
} from "@/api/v1/dtos/community";

export function listCommunities(
  pagination?: Partial<request.PaginationParams>
) {
  return request.Get<request.PaginationResponse<Community>>(
    "/v1/management/communities",
    pagination
  );
}

export function addCommunity(community: CreateCommunityDto) {
  return request.Post<Community>("/v1/management/communities", community);
}

export function getCommunityById(communityId: number) {
  return request.Get<Community>(`/v1/management/communities/${communityId}}`);
}

// export function updateCommunityInfo(
//   communityId: number,
//   updateInfo: UpdateCommunityDto
// ) {
//   return request.Put(`/v1/management/communities/${communityId}`, updateInfo);
// }

export function deleteCommunity(communityId: number) {
  return request.Delete(`/v1/management/communities/${communityId}`);
}

export function exportCommunity(communityId: number) {
  return request.Get<TransferCommunityDto>(
    `/v1/management/communities/${communityId}/export`
  );
}

export function importCommunity(community: TransferCommunityDto) {
  return request.Post(`/v1/management/communities/import`, community);
}
