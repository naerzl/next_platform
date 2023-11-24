export type TypeSubsectionData = {
  id: number
  parent_id: string
  code: string
  class_name: string
  name: string
  expect: string
  is_prefix: number
  is_spec: string
  is_highspeed: 1 | 0
  parent_name: string
  key?: string
  subpart_type: "basic" | "sync"
  subpart_class: EnumNodeType
  is_prefix: 0 | 1
  children?: TypeSubSectionData[]
  isCloseChildren?: boolean
  noChildren?: boolean
}
