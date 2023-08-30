import React from "react"
const LayoutContext = React.createContext<{
  scroll: {
    top: number
  }
}>({
  scroll: {
    top: 0,
  },
})

export default LayoutContext
