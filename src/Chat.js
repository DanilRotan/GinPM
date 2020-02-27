import "./Chat.scss";

import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

import Chats from "./components/Chats/Chats";
import Contacts from "./components/Contacts/Contacts";
import Header from "./components/Header/Header";
import Login from "./components/Login/Login";
import Messages from "./components/Mesages/Messages";
import React from "react";
import { connect } from "react-redux";
import { getChatData } from "./actions/chat.actions";

class Chat extends React.Component {
  componentDidUpdate() {
    const { myUser } = this.props;
    if (myUser) {
      this.props.getChatData();
    }
  }

  render() {
    const { myUser } = this.props;

    return (
      <>
        {!myUser ? (
          <Login />
        ) : (
          <>
            <div className="app_body">
              <Router>
                <div className="left_decoration_line"></div>
                <div className="head-component">
                  <Header />
                  <div className="body-head-component">
                    <div className="left-section">
                      <Switch>
                        <Route path="/chats" component={Chats} />
                        <Route path="/contacts" component={Contacts} />
                        <Route path="/" component={Chats} />
                      </Switch>
                    </div>
                    <div className="right-section">
                      <Messages />
                    </div>
                  </div>
                </div>
              </Router>
            </div>
          </>
        )}
      </>
    );
  }
}
const mapStateToProps = state => {
  return {
    activeUser: state.activeUser,
    myUser: state.myUser
  };
};

const mapDispatchToProps = {
  getChatData
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
