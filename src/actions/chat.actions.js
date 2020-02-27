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

import { API_URL } from "../constants/routes";
import axios from "axios";
import { database } from "../config/firebase";

const subscribeForChat = (dispatch, chatId) => {
  const messagesRef = database.ref(`chats/${chatId}/messages`);

  messagesRef.on("child_added", snapshot => {
    console.log(snapshot, snapshot.val());
    dispatch({
      type: RECEIVE_MESSAGE,
      payload: {
        chatId,
        id: snapshot.key,
        ...snapshot.val()
      }
    });
  });
  messagesRef.on("child_removed", snapshot => {
    dispatch({
      type: DELETE_MESSAGE,
      payload: {
        id: snapshot.key
      }
    });
  });
  messagesRef.on("child_changed", snapshot => {
    // need to implement
  });
};

export const getChatData = () => {
  return async (dispatch, getState) => {
    const { myUser } = getState();
    const { data: users } = await axios.get(`${API_URL}/users.json`);
    dispatch({
      type: GET_USERS,
      payload: users
    });
    const friends = users[myUser.id].friends || {};
    Object.entries(friends).forEach(async ([friendId, friend]) => {
      const chatId = friend.chat;
      if (!chatId) {
        return;
      }
      await axios
        .get(`${API_URL}/chats/${chatId}.json`)
        .then(response => {
          dispatch({
            type: GET_CHAT,
            payload: {
              id: chatId,
              data: response.data
            }
          });
        })
        .catch(e => console.log(e));

      subscribeForChat(dispatch, chatId);
    });
  };
};

export const selectChat = key => {
  return dispatch => {
    dispatch({
      type: SELECT_CHAT,
      payload: key
    });
    dispatch({
      type: CLOSE_INFO,
      payload: null
    });
  };
};

export const selectUser = key => {
  return {
    type: SELECT_USER,
    payload: key
  };
};

export const showInfo = () => {
  return {
    type: SHOW_USER_INFO,
    payload: true
  };
};

export const closeInfo = () => {
  return {
    type: CLOSE_USER_INFO,
    payload: false
  };
};

export const showChatMenu = () => {
  return {
    type: SHOW_CHAT_MENU,
    payload: true
  };
};

export const closeChatMenu = () => {
  return {
    type: CLOSE_CHAT_MENU,
    payload: false
  };
};

export const addMessage = value => {
  return (dispatch, getState) => {
    const { activeChat, myUser } = getState();
    const datetime = new Date().getTime();
    axios
      .post(`${API_URL}/chats/${activeChat}/messages.json`, {
        text: value,
        author: myUser.id,
        datetime
      })
      .catch(e => console.log(e));
  };
};

export const addFriend = friendId => {
  return async (dispatch, getState) => {
    const { myUser, chats } = getState();

    let chatId = null;
    if (chats) {
      Object.entries(chats).forEach(([id, chat]) => {
        if (chat.users[friendId]) {
          chatId = id;
        }
      });
    }

    if (!chatId) {
      const { data } = await axios
        .post(`${API_URL}/chats.json`, {
          users: {
            [myUser.id]: true,
            [friendId]: true
          }
        })
        .catch(e => console.log(e));

      chatId = data.name;
      writeFriendData({ chatId: data.name, friendId, myUser, dispatch });
    } else {
      writeFriendData({ chatId, friendId, myUser, dispatch });
    }
  };
};

export const writeFriendData = async ({ chatId, friendId, myUser, dispatch }) => {
  await axios
    .patch(`${API_URL}/users/${myUser.id}/friends.json`, {
      [friendId]: { chat: chatId }
    })
    .catch(e => console.log(e));

  await axios
    .patch(`${API_URL}/users/${friendId}/friends.json`, {
      [myUser.id]: { chat: chatId }
    })
    .catch(e => console.log(e));

  subscribeForChat(dispatch, chatId);

  dispatch({
    type: ADD_FRIEND,
    payload: friendId
  });

  dispatch({
    type: CREATE_CHAT,
    payload: {
      id: chatId,
      users: {
        [friendId]: true,
        [myUser.id]: true
      }
    }
  });
};

export const deleteMessage = id => {
  return (dispatch, getState) => {
    const { activeChat } = getState();
    axios.delete(`${API_URL}/chats/${activeChat}/messages/${id}.json`).catch(e => console.log(e));
  };
};

export const cleanChat = key => {
  return dispatch => {
    axios
      .delete(`${API_URL}/chats/${key}/messages/.json`)
      .then(response => {
        dispatch({
          type: CLEAN_CHAT,
          payload: {
            id: key
          }
        });
      })
      .catch(e => console.log(e));
  };
};

export const deleteFriend = friendId => {
  return async (dispatch, getState) => {
    const { myUser, users, chats } = getState();

    await axios
      .delete(`${API_URL}/users/${myUser.id}/friends/${friendId}.json`)
      .catch(e => console.log(e));

    await axios
      .delete(`${API_URL}/users/${friendId}/friends/${myUser.id}.json`)
      .catch(e => console.log(e));

    dispatch({
      type: DELETE_FRIEND,
      payload: friendId
    });

    const chat = Object.entries(chats).find(([chatId, chat]) => {
      return chat.users[friendId];
    });
    const chatId = chat[0];

    dispatch({
      type: DELETE_CHAT,
      payload: { id: chatId }
    });

    dispatch(getChatData());
  };
};

export const getValue = value => {
  return {
    type: GET_SEARCH_VALUE,
    payload: value
  };
};

export const dischargeActiveUser = () => {
  return {
    type: CLOSE_INFO,
    payload: null
  };
};

export const selectFoundMessage = key => {
  return {
    type: SELECT_FOUND_MESSAGE,
    payload: key
  };
};

export const setMyUser = id => {
  return {
    type: SET_MY_USER,
    payload: id
  };
};
