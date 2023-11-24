import React from "react"
import { ProjectListData } from "@/app/project-management/types"
export function useAddOrEditProject() {
  const [drawerOpen, setDrawerOpen] = React.useState(false)

  const [editItem, setEditItem] = React.useState<ProjectListData | null>(null)

  const handleAddProject = () => {
    setDrawerOpen(true)
  }

  const handleEditProject = (item: ProjectListData) => {
    setDrawerOpen(true)
    setEditItem(item)
  }

  const handleCloseProjectWithDrawer = () => {
    setDrawerOpen(false)
    setEditItem(null)
  }

  return {
    drawerOpen,
    editItem,
    handleAddProject,
    handleEditProject,
    handleCloseProjectWithDrawer,
  }
}
