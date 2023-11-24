// 获取EBS结构列表参数
export interface ReqGetEBSListParams {
  code?: string
  level?: string | number
}

// 树型结构里面对象数据类型
export interface EBSTreeData {
  id: number
  code: string
  name: string
  level: number
  unit: string
  is_loop: string
  has_structure: "yes" | "no"
  has_children: "yes" | "no"
  structure_status: string
  children?: EBSTreeData[]
  noChildren?: boolean
  childrenCount?: {
    platform: number
    system: number
    userdefined: number
    none: number
  }
}

// 新增EBS物资结构数据
export interface ReqPostEBSAddTagsParams {
  collection_id?: number
  ebs_id?: number
  id?: number
}

// 基础数据列表数据
export interface EBSBaseData {
  id: number
  title: string
  type: number
  dictionary_id: number
}

// 新增EBS物资结构数据 相应结果
export interface ReqPostEBSAddTagsResponce {
  name: string
  id: number
}

// 编辑EBS物资数据结构请求 参数
export interface ReqPutEBSParams {
  name: string
  id: number
  ebs_id: number
}

// 添加ebs基础数据的请求参数
export interface ReqPostAddEBSBaseDataParams {
  ebs_id: number
  material_structure_id: number
  title: string
  type: number
  dictionary_id: number
}

// 添加ebs基础数据的响应结果
export interface ReqPostAddEBSBaseDataResponse {
  ebs_id: number
  title: string
  type: number
  dictionary_id: number
}
// 添加ebs基础数据的请求参数
export interface ReqPutEditEBSBaseDataParams {
  id: number
  ebs_id: number
  title: string
  type: number
  dictionary_id: number
}
