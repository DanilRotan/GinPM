import {
  ADD_FRIEND,
  ADD_MESSAGE,
  CLEAN_CHAT,
  CLOSE_CHAT_MENU,
  CLOSE_INFO,
  CLOSE_USER_INFO,
  CREATE_CHAT,
  DELETE_CHAT,
  DELETE_FRIEND,
  DELETE_MESSAGE,
  GET_CHAT,
  GET_SEARCH_VALUE,
  GET_USERS,
  RECEIVE_MESSAGE,
  SELECT_CHAT,
  SELECT_FOUND_MESSAGE,
  SELECT_USER,
  SET_MY_USER,
  SHOW_CHAT_MENU,
  SHOW_USER_INFO
} from "../constants/action-types";

const initialState = {
  chats: null,
  users: null,
  activeUser: null,
  activeChat: "chat001",
  searchValue: "",
  activeMessage: null,
  myUser: null,
  isShowInfo: false,
  isShowChatMenu: false
};

function chatReducer(state = initialState, action) {
  switch (action.type) {
    case GET_USERS:
      return {
        ...state,
        users: action.payload
      };
    case GET_CHAT:
      return {
        ...state,
        chats: { ...state.chats, [action.payload.id]: action.payload.data }
      };
    case SELECT_CHAT:
      return {
        ...state,
        activeChat: action.payload
      };
    case SELECT_USER:
      return {
        ...state,
        activeUser: action.payload,
        isShowChatMenu: false
      };
    case GET_SEARCH_VALUE:
      return {
        ...state,
        searchValue: action.payload
      };
    case CLOSE_INFO:
      return {
        ...state,
        activeUser: action.payload,
        searchValue: ""
      };
    case SHOW_USER_INFO:
      return {
        ...state,
        isShowInfo: action.payload
      };
    case CLOSE_USER_INFO:
      return {
        ...state,
        isShowInfo: action.payload
      };
    case SHOW_CHAT_MENU:
      return {
        ...state,
        isShowChatMenu: action.payload
      };
    case CLOSE_CHAT_MENU:
      return {
        ...state,
        isShowChatMenu: action.payload
      };
    case SELECT_FOUND_MESSAGE:
      return {
        ...state,
        activeMessage: action.payload
      };
    case ADD_MESSAGE: {
      const { id, ...payload } = action.payload;
      return {
        ...state,
        chats: {
          ...state.chats,
          [state.activeChat]: {
            ...state.chats[state.activeChat],
            messages: {
              ...state.chats[state.activeChat].messages,
              [id]: payload
            }
          }
        }
      };
    }
    case RECEIVE_MESSAGE: {
      const { chatId, id, ...payload } = action.payload;
      const chats = state.chats || {};
      const chat = chats[chatId] || {};
      const messages = chat.messages || {};

      return {
        ...state,
        chats: {
          ...chats,
          [chatId]: {
            ...chat,
            messages: {
              ...messages,
              [id]: payload
            }
          }
        }
      };
    }
    case CREATE_CHAT: {
      const { id, ...payload } = action.payload;
      return {
        ...state,
        chats: {
          ...state.chats,
          [id]: payload
        },
        activeChat: id
      };
    }

    case DELETE_MESSAGE:
      let messages = { ...state.chats[state.activeChat].messages };
      delete messages[action.payload.id];
      return {
        ...state,
        chats: {
          ...state.chats,
          [state.activeChat]: {
            ...state.chats[state.activeChat],
            messages: messages
          }
        }
      };

    case CLEAN_CHAT:
      return {
        ...state,
        chats: {
          ...state.chats,
          [state.activeChat]: {
            ...state.chats[state.activeChat],
            messages: {}
          }
        }
      };

    case ADD_FRIEND:
      const userId = state.myUser.id;
      return {
        ...state,
        users: {
          ...state.users,
          [userId]: {
            ...state.users[userId],
            friends: {
              ...state.users[userId].friends,
              [action.payload]: true
            }
          }
        },
        searchValue: ""
      };
    case DELETE_FRIEND:
      const author = state.myUser.id;
      const newFriends = state.users[author].friends;
      delete newFriends[action.payload];
      return {
        ...state,
        users: {
          ...state.users,
          [author]: {
            ...state.users[author],
            friends: {
              ...newFriends
            }
          }
        },
        activeChat: null,
        activeUser: null,
        searchValue: ""
      };
    case DELETE_CHAT:
      let chats = { ...state.chats };
      delete chats[action.payload.id];
      return {
        ...state,
        chats: chats,
        isShowChatMenu: false
      };
    case SET_MY_USER:
      return {
        ...state,
        myUser: action.payload
      };

    default:
      return state;
  }
}

export default chatReducer;
