import React from "react";
import "../Navigation/Navigation.scss";
import { getValue } from "../../actions/chat.actions";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import chatsImg from "../../img/svg/chat.svg";
import contactsImg from "../../img/svg/contacts.svg";

function Navigation({ getValue }) {
  return (
    <div className="navigation">
      <Link className="link" to="/contacts" title="Контакты">
        <img src={contactsImg} alt="users" onClick={() => getValue("")}></img>
      </Link>

      <Link className="link" to="/chats" title="Чаты">
        <img src={chatsImg} alt="chats" onClick={() => getValue("")}></img>
      </Link>
    </div>
  );
}
const mapDispatchToProps = {
  getValue
};

export default connect(null, mapDispatchToProps)(Navigation);
