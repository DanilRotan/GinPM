import "../Chats/Chats.scss";

import { selectChat, selectFoundMessage } from "../../actions/chat.actions";

import Navigation from "../Navigation/Navigation";
import React from "react";
import Search from "../Search/Search";
import { connect } from "react-redux";
import noMessage from "../../img/svg/no-message.svg";

function Chats({
  chats,
  users,
  selectChat,
  activeChat,
  searchValue,
  selectFoundMessage,
  myUser
}) {
  const myId = myUser.id;
  const handleSelectChat = (chatKey, messageKey) => {
    selectFoundMessage(messageKey);
    selectChat(chatKey);
  };

  if (!chats || Object.keys(chats).length === 0) {
    return (
      <div className="chats">
        <div className="border-top"></div>
        <div className="chats-list clean-chats-list">
          <img src={noMessage}></img>
          <p>Нет доступных чатов</p>
        </div>
        <Navigation />
      </div>
    );
  }

  const noMessagesList = Object.entries(chats)
    .filter(([id, chat]) => {
      return !chat.messages || Object.keys(chat.messages).length === 0;
    })
    .map(([id, chat]) => ({ ...chat, id, lastMessage: null }));

  const listChats = Object.entries(chats)
    .filter(([id, chat]) => {
      return chat.messages && Object.keys(chat.messages).length !== 0;
    })
    .map(([key, chat]) => {
      let lastMessage = Object.entries(chat.messages).sort((a, b) => {
        return b[1].datetime < a[1].datetime ? -1 : 1;
      })[0];
      return {
        ...chat,
        id: key,
        lastMessage
      };
    })
    .sort((a, b) => {
      return a.lastMessage[1].datetime > b.lastMessage[1].datetime ? -1 : 1;
    })
    .filter(chat => {
      let userName = Object.keys(chat.users).filter(id => {
        return id !== myId;
      });
      return (
        users[[userName][0]].firstName
          .toLowerCase()
          .includes(searchValue.toLowerCase()) ||
        users[[userName][0]].lastName
          .toLowerCase()
          .includes(searchValue.toLowerCase()) ||
        (users[[userName][0]].firstName + " " + users[[userName][0]].lastName)
          .toLowerCase()
          .includes(searchValue.toLowerCase())
      );
    });

  const allChatsList = [...listChats, ...noMessagesList];

  let list = [];

  Object.entries(chats).map(([chatId, chat]) => {
    if (!chat.messages) {
      return;
    }
    Object.entries(chat.messages).map(([messageId, message]) => {
      list.push({
        messageId,
        chatId,
        ...message
      });
    });
  });

  let listMessages = list.filter(message => {
    return message.text.toLowerCase().includes(searchValue.toLowerCase());
  });

  const hasSearch = searchValue !== "";
  const noListChats = listChats.length === 0;
  const noListMessages = listMessages.length === 0;
  const editDate = date => {
    return date < 10 ? "0" + date : date;
  };

  return (
    <div className="chats">
      <Search />
      <div className="chats-list">
        {hasSearch && (
          <>
            <div className="search-results">
              <h5 className="list-title">Сообщения:</h5>
              {noListMessages && (
                <>
                  <p>Нет результатов поиска</p>
                </>
              )}
            </div>

            <ul>
              {listMessages.map((message, i) => {
                let data = new Date(message.datetime);
                let dataTime = `${editDate(data.getHours())}:${editDate(
                  data.getMinutes()
                )}`;
                const avatar =
                  users[message.author].firstName[0] +
                  users[message.author].lastName[0];
                return (
                  <li
                    key={i}
                    className="chat"
                    onClick={() =>
                      handleSelectChat(message.chatId, message.messageId)
                    }
                  >
                    <div className="chat_content">
                      <div className="avatar">
                        <p>{avatar}</p>
                      </div>
                      <div className="chat-wrap">
                        <h2 className="chat-name">
                          {users[message.author].firstName +
                            " " +
                            users[message.author].lastName}
                        </h2>
                        <p className="chat-text">{message.text.slice(0, 26)}</p>
                      </div>
                    </div>
                    <div className="data-time">
                      <p>{dataTime}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        )}

        {hasSearch && (
          <>
            <div className="search-results">
              <h5 className="list-title">Чаты:</h5>
              {noListChats && (
                <>
                  <p>Нет результатов поиска</p>
                </>
              )}
            </div>
          </>
        )}
        <ul>
          {allChatsList.map(chat => {
            const usersList = Object.keys(chat.users).filter(id => {
              return id !== myId;
            });
            const userKey = usersList[0];
            const user = users[userKey];
            const avatar = user.firstName[0] + user.lastName[0];
            let lastMessageDatetime;
            if (chat.lastMessage) {
              const date = new Date(chat.lastMessage[1].datetime);
              lastMessageDatetime = `${editDate(date.getHours())}:${editDate(
                date.getMinutes()
              )}`;
            }
            return (
              <li
                key={chat.id}
                className={`chat ${chat.id === activeChat ? "active" : ""}`}
                onClick={() => handleSelectChat(chat.id)}
              >
                <div className="chat_content">
                  <div className="avatar">
                    <p>{avatar}</p>
                  </div>
                  <div className="chat-wrap">
                    <h2 className="chat-name">
                      {user.firstName + " " + user.lastName}
                    </h2>
                    <p className="chat-text">
                      {chat.lastMessage
                        ? chat.lastMessage[1].text.slice(0, 26)
                        : null}
                    </p>
                  </div>
                </div>
                <div className="data-time">
                  <p>{lastMessageDatetime ? lastMessageDatetime : null}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <Navigation />
    </div>
  );
}

const mapStateToProps = state => {
  return {
    chats: state.chats,
    users: state.users,
    activeChat: state.activeChat,
    searchValue: state.searchValue,
    myUser: state.myUser
  };
};

const mapDispatchToProps = {
  selectChat,
  selectFoundMessage
};
export default connect(mapStateToProps, mapDispatchToProps)(Chats);
