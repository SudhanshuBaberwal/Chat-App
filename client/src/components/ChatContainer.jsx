import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";
import CharHeader from "./CharHeader"
import MessageInput from "./MessageInput"
import MessageSkeleton from "./skeletons/MessageSkeleton"
import { useAuthStore } from "../store/userAuthStore";
import formatmessagesTime from "../lib/utils.js"

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessageLoading,
    selectedUser,
    subscriberToMessage,
    unSubscriberToMessage,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messagesEndRef = useRef(null);

  useEffect(() => {
  if (!selectedUser?._id) return;  // stop if no user selected
  getMessages(selectedUser._id);
  subscriberToMessage();
  return () => unSubscriberToMessage();
}, [selectedUser?._id, getMessages, subscriberToMessage, unSubscriberToMessage]);
  //  useEffect(() => {
  //   getmessages(selectedUser._id);

  //   subscriberToMessage();

  //   return () => unSubscriberToMessage();
  // }, [selectedUser._id, getmessages, subscriberToMessage, unSubscriberToMessage]);


  useEffect(() => {
    if (messagesEndRef.current && messages) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessageLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <CharHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <CharHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Array.isArray(messages) && messages.map((messages) => (
          <div
            key={messages._id}
            className={`chat ${
              messages.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
            ref={messagesEndRef}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    messages.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatmessagesTime(messages.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {messages.image && (
                <img
                  src={messages.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {messages.text && <p>{messages.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
