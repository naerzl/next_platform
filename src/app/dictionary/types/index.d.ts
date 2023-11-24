// 新增字典数据请求
export interface ReqAddDictionaryParams {
  name: string // 字典名换成呢个
  serial: string | number // 字典序号
  class_id: string | number // 字典分类
  properties?: string
}

// 获取字典数据请求参数
export interface ReqGetDictionaryParams {
  order: "serial"
  name?: string
  page: string | number
  limit: string | number
  order_by?: "desc" | "asc"
  class_id: number
}

// 修改字典
export interface ReqPutDictionaryParams {
  id: number
  name: string
  serial: number
  class_id: number
  properties?: string
}

// 获取数据列表响应数据
export interface ReqGetDictionaryResponse {
  count: number
  limie: number
  page: number
  items: DictionaryData[]
}

// 数据字典数据
export interface DictionaryData {
  code: string
  name: string
  id: number
  serial: number
  class_id: number
  properties: string
}

// 数据字典类型数据
export interface DictionaryClassData {
  id: number
  name: string
  serial: number
  icon: string
  relationship: string
  collapse_open?: boolean // 自己加的控制二级展开合并的
  children?: DictionaryClassData[]
}

// 获取数据列表分类响应数据
export interface ReqGetDictionaryClassResponse {
  count: number
  limit: number
  page: number
  items: DictionaryClassData[]
}

// 新增字典类别请求参数
export interface ReqAddDictionaryClassParams {
  name: string
  icon: string
  serial: number
  relationship: (string | number)[] | any[]
  parent_id?: number | null | undefined
}

// 获取字典类别列表
export interface ReqGetDictionaryClassParams {
  page?: string | number
  limit?: string | number
  parent_id?: number
}

// 修改字典类别列表
export interface ReqPutDictionaryClassParams {
  id: number
  name: string
  serial: number
  icon: string
  relationship: string[]
}
