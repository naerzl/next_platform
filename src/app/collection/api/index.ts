import { fetcher } from "@/libs/fetch"
import { FetchParams } from "@/types/api"
import {
  ReqPostAddCollectionClassParams,
  ReqGetAddCollectionClassResponse,
  ReqPostAddCollectionParams,
  ReqPostEBSStructureCollection,
} from "../types"

// 获取表结构集合分类列表
export const reqGetCollectionClass = (
  url: string,
  data?: FetchParams<{ parent_id?: number }>,
): Promise<ReqGetAddCollectionClassResponse[]> => fetcher({ url, arg: data?.arg })

//   删除表结构分类
export const reqDelCollectionClass = (url: string, data: FetchParams<{ id: number }>) =>
  fetcher({ url, arg: data.arg, method: "delete" })

//   修改表结构分类
export const reqPutCollectionClass = (
  url: string,
  data: FetchParams<ReqGetAddCollectionClassResponse>,
) => fetcher({ url, arg: data.arg, method: "put" })

//   新增表结构集合分类
export const reqPostCollectionClass = (
  url: string,
  data: FetchParams<ReqPostAddCollectionClassParams>,
) => fetcher({ url, arg: data.arg, method: "post" })

// 获取表结构结合列表
export const reqGetCollection = (
  url: string,
  data: FetchParams<{ class_id?: number; name?: string }>,
): Promise<ReqGetAddCollectionClassResponse[]> => fetcher({ url, arg: data.arg })

// 删除表结构集合
export const reqDelCollection = (url: string, data: FetchParams<{ id: number }>) =>
  fetcher({ url, arg: data.arg, method: "delete" })

// 新增表结构集合
export const reqPostAddCollection = (url: string, data: FetchParams<ReqPostAddCollectionParams>) =>
  fetcher({ url, arg: data.arg, method: "post" })

//   修改表结构集合
export const reqPutEditCollection = (
  url: string,
  data: FetchParams<{ id: number; name: string }>,
) => fetcher({ url, arg: data.arg, method: "put" })

// 添加基础数据
export const reqPostEBSStructure = (
  url: string,
  data: FetchParams<ReqPostEBSStructureCollection>,
) => fetcher({ url, arg: data.arg, method: "post" })

// 获取基础数据
export const reqGetEBSStructure = (url: string, data: FetchParams<{ collection_id: number }>) =>
  fetcher({ url, arg: data.arg })

// 获取基础数据
export const reqDelEBSStructure = (url: string, data: FetchParams<{ id: number }>) =>
  fetcher({ url, arg: data.arg, method: "delete" })
