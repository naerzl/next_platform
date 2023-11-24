import { fetcher } from "@/libs/fetch"
import { FetchParams } from "@/types/api"
import { TypeSubsectionData } from "../types"

// 获取分部分项列表
export const reqGetSubsection = (
  url: string,
  {
    arg,
  }: FetchParams<{
    parent_id?: string
    subpart_class?: string
    name?: string
    is_highspeed?: 0 | 1
  }>,
): Promise<TypeSubsectionData[]> => fetcher({ url, arg })

export const reqPutSubsection = (
  url: string,
  {
    arg,
  }: FetchParams<{
    id: number
    subpart_type?: "basic" | "sync"
    is_prefix?: 0 | 1
  }>,
) => fetcher({ url, arg, method: "put" })
