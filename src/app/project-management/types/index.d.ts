import { BasePager } from "@/types/api"

export interface PostProjectParams {
  name: string
  creator: string
  abbreviation: string
  cost: number
  desc: string
  expired_at: string
  started_at: string
  completed_at: string
  project_type: string
}

export interface PutProjectParams {
  id: number
  name: string
  creator: string
  abbreviation: string
  cost: number
  desc: string
  expired_at: string
  started_at: string
  completed_at: string
  project_type: string
}

export interface ProjectListData {
  id: number
  name: string
  creator: string
  abbreviation: string
  cost: number
  desc: string
  expired_at: string
  started_at: string
  completed_at: string
  project_type: string
  created_at: string
  updated_at: string
}

export interface GetProjectResponse {
  items: ProjectListData[]
  page: BasePager
}

export interface DescJsonType {
  section_name: string
  construction_unit: string
  construction_organization: string
  supervising_unit: string
  design_unit: string
  leader: string
}
