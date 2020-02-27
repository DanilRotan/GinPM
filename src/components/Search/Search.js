import "../Search/Search.scss";

import { dischargeActiveUser, getValue } from "../../actions/chat.actions";

import React from "react";
import { connect } from "react-redux";
import searchImg from "../../img/svg/search.svg";

function Search({ getValue, dischargeActiveUser }) {
  const handleChange = e => {
    getValue(e.target.value);
  };

  return (
    <div className="chats-search">
      <div className="search-icon">
        <img src={searchImg} alt="search"></img>
      </div>
      <input
        type="text"
        className="search"
        placeholder="Поиск..."
        onClick={dischargeActiveUser}
        onChange={handleChange}
      ></input>
    </div>
  );
}

const mapDispatchToProps = {
  getValue,
  dischargeActiveUser
};
export default connect(null, mapDispatchToProps)(Search);
