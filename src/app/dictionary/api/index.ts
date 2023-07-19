import { FetchParams, ReqFetch } from "@/types/api"
import { formDataInstance } from "@/libs/init_oauth"
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
import { getV1BaseURL } from "@/libs/fetch"
import { getCookieAccessToken } from "@/libs/methods"

// 添加字典
export const reqPostAddDictionary = (
  url: string,
  { arg }: FetchParams<ReqAddDictionaryParams>,
): Promise<ReqFetch<null>> => {
  return fetch(getV1BaseURL(url), {
    method: "post",
    body: formDataInstance.convertModelToFormData(arg),
    headers: {
      Authorization: `Bearer ${getCookieAccessToken()}`,
    },
  }).then((res) => res.json())
}

// 删除字典
export const reqDeleteDictionary = (url: string, { arg }: FetchParams<{ id: string | number }>) => {
  return fetch(`${getV1BaseURL(url)}/${arg.id}`, {
    method: "delete",
    body: formDataInstance.convertModelToFormData(arg),
    headers: {
      Authorization: `Bearer ${getCookieAccessToken()}`,
    },
  }).then((res) => res.json())
}

// 修改字典
export const reqPutDictionary = (
  url: string,
  { arg }: FetchParams<ReqPutDictionaryParams>,
): Promise<ReqFetch<null>> => {
  return fetch(getV1BaseURL(url), {
    method: "put",
    body: formDataInstance.convertModelToFormData(arg),
    headers: {
      Authorization: `Bearer ${getCookieAccessToken()}`,
    },
  }).then((res) => res.json())
}

// 获取字典数据列表
export const reqGetDictionary = (
  url: string,
  { arg }: FetchParams<ReqGetDictionaryParams>,
): Promise<ReqFetch<ReqGetDictionaryResponse>> => {
  return fetch(`${getV1BaseURL(url)}?${new URLSearchParams(arg as any).toString()}`, {
    method: "get",
    headers: {
      Authorization: `Bearer ${getCookieAccessToken()}`,
    },
  }).then((res) => res.json())
}

// 新增字典类别
export const reqPostDictionaryClass = (
  url: string,
  { arg }: FetchParams<ReqAddDictionaryClassParams>,
) => {
  return fetch(getV1BaseURL(url), {
    method: "post",
    body: formDataInstance.convertModelToFormData(arg),
    headers: {
      Authorization: `Bearer ${getCookieAccessToken()}`,
    },
  }).then((res) => res.json())
}

// 获取字典类别列表
export const reqGetDictionaryClass = (
  url: string,
  { arg }: FetchParams<ReqGetDictionaryClassParams>,
): Promise<ReqFetch<ReqGetDictionaryClassResponse>> => {
  return fetch(`${getV1BaseURL(url)}?${new URLSearchParams(arg as any).toString()}`, {
    method: "get",
    headers: {
      Authorization: `Bearer ${getCookieAccessToken()}`,
    },
  }).then((res) => res.json())
}

// 修改字典类别
export const reqPutDictionaryClass = (
  url: string,
  { arg }: FetchParams<ReqPutDictionaryClassParams>,
) => {
  return fetch(getV1BaseURL(url), {
    method: "put",
    body: formDataInstance.convertModelToFormData(arg),
    headers: {
      Authorization: `Bearer ${getCookieAccessToken()}`,
    },
  }).then((res) => res.json())
}

// 删除字典类别
export const reqDeleteDictionaryClass = (
  url: string,
  { arg }: FetchParams<{ id: string | number }>,
): Promise<ReqFetch<null>> => {
  return fetch(`${getV1BaseURL(url)}/${arg.id}`, {
    method: "delete",
    body: formDataInstance.convertModelToFormData(arg),
    headers: {
      Authorization: `Bearer ${getCookieAccessToken()}`,
    },
  }).then((res) => res.json())
}
