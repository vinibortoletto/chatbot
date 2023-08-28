import React, { useContext } from 'react'
import ChatHeader from '../components/ChatHeader'
import MessageField from '../components/MessageField'
import { MessageContext } from '../contexts/MessageContext'
import MessageCard from '../components/MessageCard'

export default function Home() {
  const { messageList } = useContext(MessageContext)

  return (
    <div className="rounded-b-lg">
      <ChatHeader />

      <div className="flex h-96 flex-col gap-1 overflow-y-scroll p-4">
        {messageList.map((message) => (
          <MessageCard
            key={message.id}
            content={message.content}
            sender={message.sender}
          />
        ))}
      </div>

      <MessageField />
    </div>
  )
}
