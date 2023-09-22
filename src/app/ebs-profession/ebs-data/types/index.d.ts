/*获取EBS结构列表 请求参数*/
export interface TypeApiGetEBSParams {
  code?: string
  level?: number
  name?: string
  locate_code_or_name?: string
}

/*获取EBS结构列表 响应数据*/

/*ebs 列表类型*/
export interface TypeEBSDataList {
  key?: string
  id: number
  created_at: string
  updated_at: string
  h_subpart_code: string
  n_subpart_code: string
  subpart_class: string
  subpart_type: string
  parent_id: number
  code: string
  define_code: string
  name: string
  level: number
  unit: string
  is_loop: "yes" | "no"
  is_system: "platform" | "system" | "userdefined" | "null"
  has_structure: string
  structure_status: string
  has_children: string
  children?: TypeEBSDataList[]
  isCloseChildren?: boolean
  childrenCount?: {
    platform: number
    system: number
    userdefined: number
    none: number
  }
  related_ebs: TypeEBSDataList
}

/*创建EBS结构 请求参数*/
export interface TypeApiPostEBSParams {
  parent_id: number
  name: string
  unit: string
  is_loop: "yes" | "no"
  subpart_class: string
  related_to?: number | string
  h_subpart_code?: string
  n_subpart_code?: string
}

/*创建EBS结构 响应结果*/
export interface TypeApiPostEBSResponse {
  id: number
  structure_id: number
  ebs_id: number
  project_id: number
  value: string
}

/*修改EBS结构 请求参数*/
export interface TypeApiPutEBSParams {
  id: number
  name: string
  h_subpart_code: string
  n_subpart_code: string
  subpart_class: string
  is_loop: "yes" | "no"
  related_to?: number | string
}

/*获取EBS指定code 接口的相应数据*/
export interface TypeApiGetCodeCountResponse {
  platform: number
  system: number
  userdefined: number
  none: number
}

// 获取EBS指定code请求参数
export interface TypeApiGEtCodeCountParams {
  code: string
  level: number
}

// 获取EBS指定code或者名称下的相关数据
export interface TypeApiGetCodeRelationship {
  id: number
  code: string
  name: string
  relationShips: {
    id: number
    code: string
    name: string
    level: number
  }[]
}

// 基础工序类型
export interface ProcessListData {
  id: number
  name: string
  desc: string
  created_at: string
  updated_at: string
  percentage: number
  stage: number
  roles: ProcessRoleData[]
}

export interface ProcessRoleData {
  flag: string
  flag_name: string
}

export interface TypeApiPostProcessParams {
  ebs_id: number
  name: string
  desc: string
  percentage: number
  stage: number
}

export interface TypeApiPutProcessParams {
  id: number
  name: string
  desc: string
  percentage: number
  stage: number
}

export interface ProcessFormListData {
  id: number
  process_id: number
  form_no: string
  name: string
  desc: string
  is_loop: number
  created_at: string
  updated_at: string
  roles: ProcessRoleData[]
}

export interface TypeApiPostProcessFormParams {
  process_id: number
  name: string
  desc: string
  is_loop: number
  role_flags: string
}
