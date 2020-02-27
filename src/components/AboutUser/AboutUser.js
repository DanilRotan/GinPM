import React from "react";
import "../AboutUser/AboutUser.scss";
import { connect } from "react-redux";

function AboutUser({ users, chats, isShowInfo, myUser }) {
  if (!users) {
    return null;
  }
  const myId = myUser.id;
  const avatar = users[myId].firstName[0] + users[myId].lastName[0];

  const onExit = () => {
    window.location.reload();
  };
  return (
    <div className={`about-user-conteiner ${isShowInfo ? "active" : ""}`}>
      <div className="user_info">
        <div className="user-info_wrap">
          <div className="user-avatar">
            <p>{avatar}</p>
          </div>
          <div className="other-info">
            <h1>{users[myId].firstName + " " + users[myId].lastName}</h1>
            <p className="user-name">{users[myId].username}</p>
            <p className="user_email">{`Email: ${users[myId].email}`}</p>
          </div>
        </div>
        <div className="exit_button">
          <button onClick={onExit}>Выйти</button>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    chats: state.chats,
    users: state.users,
    isShowInfo: state.isShowInfo,
    myUser: state.myUser
  };
};

export default connect(mapStateToProps, null)(AboutUser);
