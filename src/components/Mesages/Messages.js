import React, { useRef, useEffect } from "react";
import "../Mesages/Messages.scss";
import Input from "../MessageInput/Input";
import {
  deleteMessage,
  selectUser,
  selectFoundMessage,
  showChatMenu,
  closeChatMenu
} from "../../actions/chat.actions";
import { connect } from "react-redux";
import UserInfo from "../UserInfo/UserInfo";
import ChatMenu from "../ChatMenu/ChatMenu";
import imgDeleteMessage from "../../img/svg/delete_msg.svg";
import chatMenu from "../../img/svg/chat-menu.svg";
import openChat from "../../img/svg/open_chat.svg";
import startDialog from "../../img/svg/start_dialog.svg";

function Messages({
  chats,
  users,
  activeChat,
  deleteMessage,
  selectUser,
  activeMessage,
  selectFoundMessage,
  activeUser,
  myUser,
  showChatMenu,
  closeChatMenu,
  isShowChatMenu
}) {
  const containerRef = useRef(null);
  const myId = myUser.id;

  useEffect(() => {
    if (activeMessage !== null && containerRef.current !== null) {
      let el = containerRef.current.querySelector(
        `[data-id="${activeMessage}"]`
      );
      if (el) {
        let scrollValue = el.offsetTop - (containerRef.current.offsetTop + 200);
        containerRef.current.scrollTo(0, scrollValue);
        setTimeout(() => {
          selectFoundMessage(null);
        }, 500);
      }
    }
  }, [activeMessage]);
  const handleScroll = () => {
    let scrollHeight = containerRef.current.scrollHeight + 1000;
    containerRef.current.scrollTo(0, scrollHeight);
  };
  if (
    activeChat === null ||
    !chats ||
    Object.keys(chats).length === 0 ||
    !users
  ) {
    return (
      <div className="messages">
        <div className="messages-title top-border"></div>
        <div className="messages-section clean-message-section">
          <img src={startDialog}></img>
          <p>Начните диалог</p>
        </div>
        <Input />
        {activeUser && <UserInfo />}
      </div>
    );
  }
  const chat = chats[activeChat];
  if (!chat) {
    return (
      <div className="messages">
        <div className="messages-title top-border"></div>
        <div className="messages-section clean-message-section">
          <img src={openChat}></img>
          <p>Выберите диалог</p>
        </div>
        <Input containerRef={containerRef} />
        {activeUser && <UserInfo />}
      </div>
    );
  }
  const usersList = Object.keys(chats[activeChat].users).filter(id => {
    return id !== myId;
  });
  const userKey = usersList[0];
  const userFirstName = users[userKey].firstName;
  const userLastName = users[userKey].lastName;
  const userName = userFirstName + " " + userLastName;
  const avatar = userFirstName[0] + userLastName[0];

  const onDeleteMessage = id => {
    deleteMessage(id);
  };
  const handleSelectUser = key => {
    selectUser(key);
  };

  const onShowChatMenu = () => {
    if (isShowChatMenu) {
      closeChatMenu();
    } else {
      showChatMenu();
    }
  };

  if (!chat.messages || Object.keys(chat.messages).length === 0) {
    return (
      <div className="messages">
        <div className="messages-title">
          <div className="user_info_wrap">
            <div className="avatar">
              <p>{avatar}</p>
            </div>
            <div className="title_name_wrap">
              <h1 onClick={() => handleSelectUser(userKey)}>{userName}</h1>
              <p>Online</p>
            </div>
          </div>
          <div className="chat_menu">
            <img src={chatMenu} onClick={onShowChatMenu}></img>
            <ChatMenu />
          </div>
        </div>
        <div className="messages-section clean-message-section">
          <p>Начните общение</p>
        </div>
        <Input onItemAdded={handleScroll} />
        {activeUser && <UserInfo />}
      </div>
    );
  }

  const messages = Object.entries(chat.messages).sort((a, b) => {
    return b[1].datetime > a[1].datetime ? -1 : 1;
  });

  const editDate = date => {
    return date < 10 ? "0" + date : date;
  };

  return (
    <div className="messages">
      <div className="messages-title">
        <div className="user_info_wrap">
          <div className="avatar">
            <p>{avatar}</p>
          </div>
          <div className="title_name_wrap">
            <h1 onClick={() => handleSelectUser(userKey)}>{userName}</h1>
            <p>Online</p>
          </div>
        </div>
        <div className="chat_menu">
          <img src={chatMenu} onClick={onShowChatMenu}></img>
          <ChatMenu />
        </div>
      </div>
      <div className="messages-section" ref={containerRef}>
        {messages.map(([id, message]) => {
          let data = new Date(message.datetime);
          let dataTime = `${editDate(data.getHours())}:${editDate(
            data.getMinutes()
          )}`;
          const avatar = users[message.author].firstName[0];
          return (
            <div
              className={`messages-${
                message.author === myId ? "right" : "left"
              }`}
              key={id}
              data-id={id}
            >
              <div className="messages-conteiner">
                <div className="avatar">
                  <p>{avatar}</p>
                </div>
                <div
                  className={`message ${id === activeMessage ? "active" : ""}`}
                >
                  <p>{message.text}</p>
                  <p className="data-time">{dataTime}</p>
                </div>
                <div
                  className="delete-button"
                  onClick={() => onDeleteMessage(id)}
                >
                  <img src={imgDeleteMessage}></img>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <Input onItemAdded={handleScroll} />
      {activeUser && <UserInfo />}
    </div>
  );
}
const mapStateToProps = state => {
  return {
    chats: state.chats,
    users: state.users,
    activeChat: state.activeChat,
    activeMessage: state.activeMessage,
    activeUser: state.activeUser,
    myUser: state.myUser,
    isShowChatMenu: state.isShowChatMenu
  };
};
const mapDispatchToProps = {
  deleteMessage,
  selectUser,
  selectFoundMessage,
  showChatMenu,
  closeChatMenu
};
export default connect(mapStateToProps, mapDispatchToProps)(Messages);
