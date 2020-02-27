import React from "react";
import "../Header/Header.scss";
import AboutUser from "../AboutUser/AboutUser";
import { showInfo, closeInfo } from "../../actions/chat.actions";
import { connect } from "react-redux";
import logo from "../../img/logo.png";

function Header({ users, showInfo, isShowInfo, closeInfo, myUser }) {
  if (!users) {
    return null;
  }
  const myId = myUser.id;
  const avatar = users[myId].firstName[0];
  const name = users[myId].firstName;
  const onShowInfo = () => {
    if (isShowInfo) {
      closeInfo();
    } else {
      showInfo();
    }
  };
  return (
    <div className="header_content">
      <div className="header_section">
        <div className="logo">
          <img src={logo}></img>
        </div>
        <div className="about_user">
          <div className="user_avatar">
            <p>{avatar}</p>
          </div>
          <div className={`user_name ${isShowInfo ? "active" : ""}`}>
            <p onClick={() => onShowInfo()}>{name}</p>
            <span onClick={() => onShowInfo()}>&#9660;</span>
            <AboutUser />
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    chats: state.chats,
    users: state.users,
    activeChat: state.activeChat,
    searchValue: state.searchValue,
    isShowInfo: state.isShowInfo,
    myUser: state.myUser
  };
};

const mapDispatchToProps = {
  showInfo,
  closeInfo
};
export default connect(mapStateToProps, mapDispatchToProps)(Header);
