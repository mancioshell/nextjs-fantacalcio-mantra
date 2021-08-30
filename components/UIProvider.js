import { useState } from "react";
import UIContext from "../context/UIContext";

function UIProvider({ children }) {
  const [messages, setMessages] = useState([]);

  const addMessage = (message) => {
    let size = messages.length;
    setMessages(messages.concat([{ ...message, id: size }]));
  };

  const removeMessage = (message) => {
    setMessages(messages.filter((item) => item.id !== message.id));
  };

  return (
    <UIContext.Provider
      value={{
        messages,
        addMessage,
        removeMessage,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export default UIProvider;
export { UIProvider };
