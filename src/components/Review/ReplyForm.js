import React, { useState } from "react";
import { Mutation } from "react-apollo";
import { MESSAGE_QUERY, POST_REPLY_MUTATION } from "../../queries";

const ReplyForm = props => {
  const { messageId, toggleForm } = props;
  const [text, setText] = useState("");

  const _updateStoreAfterAddingReply = (store, newReply, messageId) => {
    const orderBy = "createdAt_DESC";
    const data = store.readQuery({
      query: MESSAGE_QUERY,
      variables: {
        orderBy
      }
    });
    const repliedMessage = data.messages.messageList.find(
      message => message.id === messageId
    );
    repliedMessage.replies.push(newReply);
    store.writeQuery({ query: MESSAGE_QUERY, data });
    toggleForm(false);
  };

  return (
    <div className="form-reply">
      <div className="input-wrapper-reply">
        <textarea
          onChange={e => setText(e.target.value)}
          placeholder="Reply text"
          autoFocus
          value={text}
          cols="25"
        />
      </div>
      {text === "" ? null : (
        <Mutation
          mutation={POST_REPLY_MUTATION}
          variables={{ messageId, text }}
          update={(store, { data: { postReply } }) => {
            _updateStoreAfterAddingReply(store, postReply, messageId);
          }}
        >
          {postMutation => <button onClick={postMutation}>Post</button>}
        </Mutation>
      )}
    </div>
  );
};

export default ReplyForm;
