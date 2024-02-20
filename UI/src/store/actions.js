export const login = (jwt_token) => ({
  type: "LOGIN",
  jwt_token,
});

export const logout = () => ({
  type: "LOGOUT",
});

export const authenticate = (response) => ({
  type: "AUTHENTICATE",
  response,
});

export const isConversationActive = (response) => ({
  type: "IS_CONVERSATION_ACTIVE",
  response,
});

export const conversationList = (response) => ({
  type: "CONVERSATION_LIST",
  response,
});

export const activeConversation = (response) => ({
  type: "ACTIVE_CONVERSATION",
  response,
});