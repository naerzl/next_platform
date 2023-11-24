import React from "react"
import ProjectManagementPage from "@/app/project-management/components/ProjectManagementPage"
import { Metadata } from "next"

function Page() {
  return <ProjectManagementPage />
}

export default Page

export const metadata: Metadata = {
  title: "项目管理-平台端",
}
