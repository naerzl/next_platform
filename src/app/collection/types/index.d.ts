/**
 * 新增表结构集合分类接口参数类型
 */
export interface ReqPostAddCollectionClassParams {
  parent_id?: number
  name: string
}

/**
 * @description:新增表结构集合分类接口响应类型
 */
export interface ReqGetAddCollectionClassResponse {
  id: number
  name: string
  children?: ReqGetAddCollectionClassResponsep[]
}

/**
 * 新增表结构集合接口参数类型
 */
export interface ReqPostAddCollectionParams {
  class_id: number
  name: string
}

/**
 * @description:新增表结构集合接口响应类型
 */
export interface ReqGetAddCollectionResponse {
  id: number
  name: string
}

export interface ReqPostEBSStructureCollection {
  structure_id?: string | number
  collection_id?: string | number
  ebs_id?: string | number
  data: string
}

export interface CollectionData {
  is_required: number | boolean
  title: string
  type: number
  dictionary_id?: number
  id?: number
  dictionary_data?: string
}
