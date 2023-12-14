import { fetcher } from "@/libs/fetch"
import { FetchParams } from "@/types/api"

import {
  ProcessFormListDataType,
  ProcessListDataType,
  TagsListDataType,
  TypeApiGetProcessParams,
  TypeApiPostProcessFormParams,
  TypeApiPostProcessParams,
  TypeApiPutProcessParams,
} from "@/app/process-list/types"

// 获取基础工序
export const reqGetProcess = (
  url: string,
  { arg }: FetchParams<TypeApiGetProcessParams>,
): Promise<ProcessListDataType[]> => fetcher({ url, arg })

// 新增基础工序
export const reqPostProcess = (url: string, { arg }: FetchParams<TypeApiPostProcessParams>) =>
  fetcher({ url, arg, method: "post" })

// 修改基础工序
export const reqPutProcess = (url: string, { arg }: FetchParams<TypeApiPutProcessParams>) =>
  fetcher({ url, arg, method: "put" })

// 新增基础工序
export const reqDelProcess = (url: string, { arg }: FetchParams<{ id: number }>) =>
  fetcher({ url, arg, method: "delete" })

// 获取基础工序--表单
export const reqGetProcessForm = (
  url: string,
  { arg }: FetchParams<{ process_id: number }>,
): Promise<ProcessFormListDataType[]> => fetcher({ url, arg })

//新增基础工序--表单
export const reqPostProcessForm = (
  url: string,
  { arg }: FetchParams<TypeApiPostProcessFormParams>,
) => fetcher({ url, arg, method: "post" })

//修改基础工序--表单
export const reqPutProcessForm = (
  url: string,
  { arg }: FetchParams<TypeApiPostProcessFormParams & { id: number }>,
) => fetcher({ url, arg, method: "put" })

//删除基础工序--表单
export const reqDelProcessForm = (url: string, { arg }: FetchParams<{ id: number }>) =>
  fetcher({ url, arg, method: "delete" })

export const reqGetTagsList = (
  url: string,
  { arg }: FetchParams<{ name?: string; flag?: string }>,
): Promise<TagsListDataType[]> => fetcher({ url, arg })

export const reqPostTagsList = (
  url: string,
  { arg }: FetchParams<{ name: string; flag: string }>,
): Promise<{ id: number }> => fetcher({ url, arg, method: "post" })
