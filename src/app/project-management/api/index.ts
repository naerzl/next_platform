import { fetcher } from "@/libs/fetch"
import { FetchParams } from "@/types/api"
import {
  GetProjectResponse,
  PostProjectParams,
  PutProjectParams,
} from "@/app/project-management/types"

// 获取项目管理记录
export const reqGetProject = (
  url: string,
  { arg }: FetchParams<{ page?: number; limit?: number; name?: string; creator?: string }>,
): Promise<GetProjectResponse> => fetcher({ url, arg })

export const reqPostProject = (url: string, { arg }: FetchParams<PostProjectParams>) =>
  fetcher({ url, arg, method: "post" })

export const reqPutProject = (url: string, { arg }: FetchParams<PutProjectParams>) =>
  fetcher({ url, arg, method: "put" })

export const reqDelProject = (url: string, { arg }: FetchParams<{ id: number; name: string }>) =>
  fetcher({ url, arg, method: "delete" })
