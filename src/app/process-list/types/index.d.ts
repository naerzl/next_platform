// 基础工序类型
export interface ProcessListDataType {
  id: number
  serial: number
  name: string
  tags: string[]
  percentage: number
  stage: number
  desc: string
  created_at: string
  updated_at: string
}

export interface ProcessRoleDataType {
  flag: string
  flag_name: string
}

export interface TypeApiGetProcessParams {
  name?: string
  tags?: string | null
}

export interface TypeApiPostProcessParams {
  name: string
  tags: string
  desc: string
  serial: number
}

export interface TypeApiPutProcessParams {
  id: number
  name: string
  tags: string
  serial: number
  desc: string
}

export interface ProcessFormListDataType {
  id: number
  process_id: number
  form_no: string
  name: string
  datum_class: string
  class: string
  desc: string
  is_loop: number
  created_at: string
  updated_at: string
  roles: ProcessRoleDataType[]
}

export interface TypeApiPostProcessFormParams {
  process_id: number
  name: string
  desc: string
  class: "ordinary" | "persistent"
  role_flags: string
  datum_class: string
}

export interface TagsListDataType {
  id: number
  name: string
  flag: string
  creator: string
  creator_unionid: string
  created_at: string
  updated_at: string
}
