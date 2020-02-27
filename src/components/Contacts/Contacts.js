import React from "react";
import "../Contacts/Contacts.scss";
import { selectUser } from "../../actions/chat.actions";
import { connect } from "react-redux";
import Navigation from "../Navigation/Navigation";
import Search from "../Search/Search";
import addUser from "../../img/svg/add-user.svg";

function Contacts({ chats, users, selectUser, searchValue, myUser }) {
  const myId = myUser.id;
  const handleSelectUser = key => {
    selectUser(key);
  };

  if (!users) {
    return null;
  }

  const sortList = Object.entries(users).sort((a, b) => {
    return a[1].firstName < b[1].firstName ? -1 : 1;
  });

  let listUsers;
  if (searchValue !== "" && searchValue[0] === "@") {
    listUsers = sortList.filter(([key, user]) => {
      return (
        key !== myId &&
        user.username
          .toLowerCase()
          .includes(searchValue.replace(searchValue[0], "").toLowerCase())
      );
    });
  } else {
    listUsers = sortList.filter(([key, user]) => {
      return (
        key !== myId &&
        (user.firstName.toLowerCase().includes(searchValue.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchValue.toLowerCase()))
      );
    });
  }
  const hasSearch = searchValue !== "";
  const noListContacts = listUsers.length === 0;
  const cleanListFriends =
    !users[myId].friends || Object.keys(users[myId].friends).length === 0;

  if (cleanListFriends) {
    return (
      <div className="contacts">
        <Search />
        {!hasSearch && (
          <>
            <div className="clean-contacts-list">
              <img src={addUser}></img>
              <p>Добавьте друзей</p>
            </div>
          </>
        )}
        {hasSearch && (
          <>
            <div className="contacts-list">
              <div className="search-results">
                <h5 className="list-title">Пользователи:</h5>
                {noListContacts && (
                  <>
                    <p>Нет результатов поиска</p>
                  </>
                )}
              </div>
              <ul>
                {listUsers.map(([key, user], i) => {
                  const avatar = user.firstName[0] + user.lastName[0];
                  return (
                    <li
                      key={i}
                      className="contact"
                      onClick={() => handleSelectUser(key)}
                    >
                      <div className="avatar">
                        <p>{avatar}</p>
                      </div>
                      <div className="contact-wrap">
                        <h2 className="contact-name">
                          {user.firstName + " " + user.lastName}
                        </h2>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </>
        )}
        <Navigation />
      </div>
    );
  }

  const listFriends = Object.entries(users[myId].friends).map(([id, value]) => {
    return { id, ...users[id] };
  });

  const noListFriends = listFriends.length === 0;

  return (
    <div className="contacts">
      <Search />
      <div className="contacts-list">
        {hasSearch && (
          <>
            <div className="search-results">
              <h5 className="list-title">Пользователи:</h5>
              {noListContacts && (
                <>
                  <p>Нет результатов поиска</p>
                </>
              )}
            </div>
            <ul>
              {listUsers.map(([key, user], i) => {
                const avatar = user.firstName[0] + user.lastName[0];
                return (
                  <li
                    key={i}
                    className="contact"
                    onClick={() => handleSelectUser(key)}
                  >
                    <div className="avatar">
                      <p>{avatar}</p>
                    </div>
                    <div className="contact-wrap">
                      <h2 className="contact-name">
                        {user.firstName + " " + user.lastName}
                      </h2>
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
              <h5 className="list-title">Друзья:</h5>
              {noListFriends && (
                <>
                  <p>Нет результатов поиска</p>
                </>
              )}
            </div>
          </>
        )}
        <ul>
          {listFriends.map((friend, key) => {
            const avatar = friend.firstName[0] + friend.lastName[0];
            const id = friend.id;
            return (
              <li
                key={key}
                className="contact"
                onClick={() => handleSelectUser(id)}
              >
                <div className="avatar">
                  <p>{avatar}</p>
                </div>
                <div className="contact-wrap">
                  <h2 className="contact-name">
                    {friend.firstName + " " + friend.lastName}
                  </h2>
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
    users: state.users,
    chats: state.chats,
    activeChat: state.activeChat,
    activeUser: state.activeUser,
    searchValue: state.searchValue,
    myUser: state.myUser
  };
};

const mapDispatchToProps = {
  selectUser
};

export default connect(mapStateToProps, mapDispatchToProps)(Contacts);
