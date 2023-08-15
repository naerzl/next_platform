import { FetchParams } from "@/types/api"
import {
  ReqAddDictionaryClassParams,
  ReqAddDictionaryParams,
  ReqGetDictionaryClassParams,
  ReqGetDictionaryClassResponse,
  ReqGetDictionaryParams,
  ReqGetDictionaryResponse,
  ReqPutDictionaryClassParams,
  ReqPutDictionaryParams,
} from "../types"
import { fetcher } from "@/libs/fetch"

// 添加字典
export const reqPostAddDictionary = (
  url: string,
  { arg }: FetchParams<ReqAddDictionaryParams>,
): Promise<null> => {
  return fetcher({ url, arg, method: "post" })
}

// 删除字典
export const reqDeleteDictionary = (url: string, { arg }: FetchParams<{ id: string | number }>) => {
  return fetcher({ url, arg, method: "delete" })
}

// 修改字典
export const reqPutDictionary = (
  url: string,
  { arg }: FetchParams<ReqPutDictionaryParams>,
): Promise<null> => {
  return fetcher({ url, arg, method: "put" })
}

// 获取字典数据列表
export const reqGetDictionary = (
  url: string,
  { arg }: FetchParams<ReqGetDictionaryParams>,
): Promise<ReqGetDictionaryResponse> => fetcher({ url, arg })

// 新增字典类别
export const reqPostDictionaryClass = (
  url: string,
  { arg }: FetchParams<ReqAddDictionaryClassParams>,
) => {
  return fetcher({ url, arg, method: "post" })
}

// 获取字典类别列表
export const reqGetDictionaryClass = (
  url: string,
  { arg }: FetchParams<ReqGetDictionaryClassParams>,
): Promise<ReqGetDictionaryClassResponse> => {
  return fetcher({ url, arg })
}

// 修改字典类别
export const reqPutDictionaryClass = (
  url: string,
  { arg }: FetchParams<ReqPutDictionaryClassParams>,
) => {
  fetcher<ReqPutDictionaryClassParams>({ url, arg, method: "put" })
}

// 删除字典类别
export const reqDeleteDictionaryClass = (
  url: string,
  { arg }: FetchParams<{ id: number }>,
): Promise<{ id: number }> => {
  return fetcher({ url, arg, method: "delete" })
}
