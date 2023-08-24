/*获取EBS结构列表 请求参数*/
export interface TypeApiGetEBSParams {
  code?: string
  level?: number
  name?: string
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
}

/*创建EBS结构 请求参数*/
export interface TypeApiPostEBSParams {
  parent_id: number
  name: string
  unit: string
  is_loop: "yes" | "no"
  subpart_class: string
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
}
