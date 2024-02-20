const initialState = {
  accessToken: "",
  data_access_expiration_time: 0,
  email: "",
  expiresIn: 0,
  graphDomain: "",
  id: "",
  name: "",
  pages: [],
  picture: {},
  signedRequest: "",
  userID: "",
  _id: "",
  login: false,
  isConversationActive: false,
  conversationList: [],
  activeConversation: {},
};

const userReducer = (state = initialState, action) => {
  console.log("Action: ", action);
  switch (action.type) {
    case "AUTHENTICATE":
      return {
        ...state,
        accessToken: action.response.accessToken,
        data_access_expiration_time:
          action.response.data_access_expiration_time,
        email: action.response.email,
        expiresIn: action.response.expiresIn,
        graphDomain: action.response.graphDomain,
        id: action.response.id,
        name: action.response.name,
        pages: action.response.pages,
        picture: action.response.picture,
        signedRequest: action.response.signedRequest,
        userID: action.response.userID,
        _id: action.response._id,
        login: true,
      };
    case "LOGOUT":
      return {
        ...state,
        accessToken: "",
        data_access_expiration_time: 0,
        email: "",
        expiresIn: 0,
        graphDomain: "",
        id: "",
        name: "",
        pages: [],
        picture: {},
        signedRequest: "",
        userID: "",
        _id: "",
        login: false,
        isConversationActive: false,
        conversationList: [],
        activeConversation: {},
      };
    case "IS_CONVERSATION_ACTIVE":
      return {
        ...state,
        isConversationActive: action.response,
      };
    case "CONVERSATION_LIST":
      return {
        ...state,
        conversationList: action.response,
      };
    case "ACTIVE_CONVERSATION":
      return {
        ...state,
        activeConversation: action.response,
      };
    default:
      return state;
  }
};

export default userReducer;
