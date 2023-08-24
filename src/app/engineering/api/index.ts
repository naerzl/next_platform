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
