import "../ChatMenu/ChatMenu.scss";

import { cleanChat, selectUser } from "../../actions/chat.actions";

import React from "react";
import bin from "../../img/svg/bin.svg";
import { connect } from "react-redux";
import eraser from "../../img/svg/clean.svg";
import user2 from "../../img/svg/user.svg";

function ChatMenu({
  users,
  chats,
  activeChat,
  selectUser,
  isShowChatMenu,
  cleanChat,
  myUser
}) {
  if (!chats || !users) {
    return null;
  }
  const myId = myUser.id;
  const chat = chats[activeChat];
  const userKey = Object.keys(chat.users).filter(userId => {
    return userId !== myId;
  })[0];

  const userName = users[userKey].name;

  const handleSelectUser = key => {
    selectUser(key);
  };
  const onCleanChat = key => {
    cleanChat(key);
  };
  return (
    <div className={`chat_menu_conteiner ${isShowChatMenu ? "active" : ""}`}>
      <ul className="list_chat_menu">
        <li>
          <img src={user2}></img>
          <p onClick={() => handleSelectUser(userKey)}>
            Посмотреть профиль {userName}
          </p>
        </li>
        <li>
          <img src={eraser}></img>
          <p onClick={() => onCleanChat(activeChat)}>Очистить переписку</p>
        </li>
      </ul>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    chats: state.chats,
    users: state.users,
    isShowInfo: state.isShowInfo,
    activeChat: state.activeChat,
    isShowChatMenu: state.isShowChatMenu,
    myUser: state.myUser
  };
};

const mapDispatchToProps = {
  selectUser,
  cleanChat
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatMenu);
