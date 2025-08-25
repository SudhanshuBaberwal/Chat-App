import React, { useEffect } from 'react'
import { useChatStore } from '../store/useChatStore';
import MessageInput from "./MessageInput"
import ChatHeader from './CharHeader';
import MessageSkeleton from "../components/skeletons/MessageSkeleton"

const ChatContainer = () => {
  const {messages , getMessages , isMessagesLoading , selectuUser} = useChatStore()
 
  useEffect(()=> {
    getMessages(selectuUser._id)
  } , [selectuUser._id , getMessages])

   if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }


  return (
    <div className='flex-1 flex-col overflow-auto'>
      <ChatHeader />
      <p>messages ...</p>

      <MessageInput />
    </div>
  )
}

export default ChatContainer;
