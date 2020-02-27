import "../UserInfo/UserInfo.scss";

import {
  addFriend,
  deleteFriend,
  dischargeActiveUser,
  getValue
} from "../../actions/chat.actions";

import React from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

function UserInfo({
  chats,
  users,
  activeUser,
  dischargeActiveUser,
  addFriend,
  deleteFriend,
  getValue,
  activeChat,
  myUser
}) {
  let history = useHistory();

  if (!activeUser) {
    return null;
  }
  const onCloseUserInfo = () => {
    dischargeActiveUser();
  };

  const onAddFriend = () => {
    addFriend(activeUser);
    history.push("/chats");
  };
  const avatar = users[activeUser].firstName[0] + users[activeUser].lastName[0];
  const myId = myUser.id;
  const noFriend = !users[myId].friends || !users[myId].friends[activeUser];
  return (
    <div className="head-info-conteiner active">
      <ReactCSSTransitionGroup
        transitionName="info-section"
        transitionEnterTimeout={300}
        transitionLeaveTimeout={300}
      >
        <div className="info-section">
          <div className="information">
            <div className="head-information">
              <div className="avatar">
                <p>{avatar}</p>
              </div>
            </div>
            <div className="other-information">
              <h1>
                {users[activeUser].firstName + " " + users[activeUser].lastName}
              </h1>
              <p className="user-name">{users[activeUser].username}</p>
              <p className="user_email">{`Email: ${users[activeUser].email}`}</p>
            </div>
          </div>
          <div className="buttons-group">
            {noFriend && (
              <div className="button add-friend">
                <button onClick={onAddFriend}>Добавить в друзья</button>
              </div>
            )}
            {!noFriend && (
              <div className="button delete-friend">
                <button onClick={() => deleteFriend(activeUser)}>
                  Удалить из друзей
                </button>
              </div>
            )}

            <div className="close-button">
              <button onClick={onCloseUserInfo}>Закрыть</button>
            </div>
          </div>
        </div>
      </ReactCSSTransitionGroup>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    users: state.users,
    chats: state.chats,
    activeUser: state.activeUser,
    activeChat: state.activeChat,
    myUser: state.myUser
  };
};

const mapDispatchToProps = {
  dischargeActiveUser,
  addFriend,
  deleteFriend,
  getValue
};

export default connect(mapStateToProps, mapDispatchToProps)(UserInfo);
