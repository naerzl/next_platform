import React from "react"
const LayoutContext = React.createContext<{
  scroll?: {
    top: number
    left: number
  }
}>({
  scroll: {
    top: 0,
    left: 0,
  },
})

export default LayoutContext
