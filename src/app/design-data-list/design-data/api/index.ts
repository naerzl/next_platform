import { FetchParams } from "@/types/api"
import { fetcher } from "@/libs/fetch"
import {
  EBSBaseData,
  EBSTreeData,
  ReqGetEBSListParams,
  ReqPostAddEBSBaseDataParams,
  ReqPostAddEBSBaseDataResponse,
  ReqPostEBSAddTagsParams,
  ReqPostEBSAddTagsResponce,
  ReqPutEBSParams,
  ReqPutEditEBSBaseDataParams,
} from "../types"
import { CollectionData, ReqGetAddCollectionClassResponse } from "@/app/collection/types"

// 获取EBS结构列表
export const reqGetEBSList = (
  url: string,
  { arg }: FetchParams<ReqGetEBSListParams>,
): Promise<EBSTreeData[]> => {
  return fetcher({ url, arg })
}

// 新增EBS物资结构
export const reqPostAddEBSTags = (
  url: string,
  { arg }: FetchParams<ReqPostEBSAddTagsParams>,
): Promise<ReqPostEBSAddTagsResponce> => fetcher({ url, arg, method: "post" })

// 获取EBS物资结构列表
export const reqGetEBSTags = (
  url: string,
  { arg }: FetchParams<{ ebs_id: number; name?: string }>,
): Promise<ReqPostEBSAddTagsResponce[]> => fetcher({ url, arg })

// 删除EBS物资结构
export const reqDeleteEBSTags = (
  url: string,
  { arg }: FetchParams<{ id: number; ebs_id: number }>,
) => fetcher({ url, method: "delete", arg })

// 编辑EBS物资结构
export const reqPutEBSTags = (url: string, { arg }: FetchParams<ReqPutEBSParams>) =>
  fetcher({ url, method: "put", arg })

// 获取当前已存在的物资标签列表
export const reqGetIsHaveTagsList = (
  url: string,
  { arg }: FetchParams<{ ebs_id: number }>,
): Promise<{ id: number; name: string }[]> => fetcher({ url, arg })

// 获取EBS基础数据列表
export const reqGetEBSBaseDataList = (
  url: string,
  { arg }: FetchParams<{ ebs_id?: number; structure_id?: number; collection_id?: number }>,
): Promise<EBSBaseData[]> => fetcher({ url, arg })

// 新增EBS基础数据
export const reqPostAddEBSBaseData = (
  url: string,
  { arg }: FetchParams<ReqPostAddEBSBaseDataParams>,
): Promise<ReqPostAddEBSBaseDataResponse> => fetcher({ url, arg, method: "post" })

// 修改EBS基础数据
export const reqPutEditEBSBaseData = (
  url: string,
  { arg }: FetchParams<ReqPutEditEBSBaseDataParams>,
): Promise<ReqPostAddEBSBaseDataResponse> => fetcher({ url, arg, method: "put" })

// 删除EBS基础数据
export const reqDeleteEBSBaseData = (
  url: string,
  { arg }: FetchParams<{ id: number; ebs_id: number }>,
): Promise<{ id: number }> => fetcher({ url, method: "delete", arg })

// 获取集合基本数据
export const reqGetCollection = (
  url: string,
  data: FetchParams<{ class_id?: number; name?: string }>,
): Promise<ReqGetAddCollectionClassResponse[]> => fetcher({ url, arg: data.arg })

export const reqDesignDataBaseData = (
  url: string,
  data: FetchParams<{ collection_id?: number; ebs_id?: number; structure_id?: number }>,
): Promise<CollectionData[]> => fetcher({ url, arg: data.arg })
