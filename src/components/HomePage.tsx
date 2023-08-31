"use client"
import React from "react"
import useSWRMutation from "swr/mutation"
import { reqGetTry } from "@/app/api"

function HomePage() {
  const { trigger: getTryApi } = useSWRMutation("/try", reqGetTry)
  React.useEffect(() => {
    getTryApi()
  }, [])
  return <div className="flex-1 flex-shrink-0 overflow-auto bg-white"></div>
}

export default HomePage
