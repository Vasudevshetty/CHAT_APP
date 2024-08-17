const Conversation = require("../models/conversationModel");

const getConversation = async (currentUserId) => {
  const userConversation = await Conversation.find({
    $or: [{ sender: currentUserId }, { receiver: currentUserId }],
  })
    .sort({ updatedAt: -1 })
    .populate("messages receiver sender");

  const conversation = userConversation.map((conversation) => {
    const countUnseenMessages = conversation.messages.reduce((prev, curr) => {
      if (curr.msgByUserId.toString() !== currentUserId)
        return prev + (curr.seen ? 0 : 1);
      else return prev;
    }, 0);
    return {
      _id: conversation._id,
      sender: conversation.sender,
      receiver: conversation.receiver,
      unseenMsg: countUnseenMessages,
      lastMsg: conversation.messages[conversation.messages.length - 1],
    };
  });
  return conversation;
};

module.exports = getConversation;
