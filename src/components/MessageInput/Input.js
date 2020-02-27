import React, { useState } from "react";
import "../MessageInput/Input.scss";
import { addMessage } from "../../actions/chat.actions";
import { connect } from "react-redux";
import enterButton from "../../img/svg/paper_plane.svg";
import emoji from "../../img/svg/smile.svg";
import Picker from "emoji-picker-react";

function Input({ addMessage, onItemAdded }) {
  const [value, setValue] = useState("");

  const [showEmoji, setShowEmoji] = useState(false);

  const onEmojiClick = (event, emojiObject) => {
    setValue(value => {
      return value + emojiObject.emoji;
    });
  };

  const handleChange = e => {
    setValue(e.target.value);
  };

  const onCloseEmoji = () => {
    setShowEmoji(false);
  };

  const onShowEmoji = () => {
    if (showEmoji) {
      setShowEmoji(false);
    } else {
      setShowEmoji(true);
    }
  };

  const onAddItem = () => {
    if (value !== "") {
      addMessage(value);
      setTimeout(() => {
        onItemAdded();
      }, 500);
    }
    if (value !== "") {
      clearValue();
    }
  };
  const clearValue = () => {
    setValue("");
  };

  return (
    <div className="input-section">
      <input
        value={value}
        placeholder="Введите сообщение"
        onChange={handleChange}
        onKeyPress={e => {
          e.nativeEvent.keyCode === 13 && onAddItem();
        }}
        onClick={onCloseEmoji}
        type="text"
      />
      <div className="emoji-conteiner">
        <div className="btn-emoji">
          <img src={emoji} onClick={onShowEmoji}></img>
        </div>
        {showEmoji && (
          <div className="emoji-block">
            <Picker onEmojiClick={onEmojiClick} />
          </div>
        )}
      </div>
      <button className="enter_button" onClick={onAddItem}>
        <img src={enterButton}></img>
      </button>
    </div>
  );
}
const mapStateToProps = state => {
  return {
    chats: state.chats,
    users: state.users,
    activeChat: state.activeChat
  };
};

const mapDispatchToProps = {
  addMessage
};
export default connect(mapStateToProps, mapDispatchToProps)(Input);
