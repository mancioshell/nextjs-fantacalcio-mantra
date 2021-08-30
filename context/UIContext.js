import React from 'react'

const value = {
  addMessage: () => {},
  removeMessage: () => {},
  messages: []
}

const UIContext = React.createContext(value)

export { UIContext }

export default UIContext
