import { Metadata } from "next"
import DesignDataPage from "./components/DesignDataPage"

export default function designData() {
  return <DesignDataPage />
}

export const metadata: Metadata = {
  title: "设计数据--平台端",
}
