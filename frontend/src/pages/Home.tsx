import React, { useContext, useEffect, useRef } from 'react'
import ChatHeader from '../components/ChatHeader'
import MessageField from '../components/MessageField'
import { MessageContext } from '../contexts/MessageContext'
import MessageCard from '../components/MessageCard'

export default function Home() {
  const { chat, isChatting } = useContext(MessageContext)
  const scrollableDivRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!scrollableDivRef.current) return
    scrollableDivRef.current.scrollTop = scrollableDivRef.current.scrollHeight
  }, [chat])

  return (
    <main className="rounded-b-lg">
      <ChatHeader />

      <div
        className="flex h-96 flex-col gap-1 overflow-y-scroll p-4"
        ref={scrollableDivRef}
      >
        {chat.messages.map((message) => (
          <MessageCard
            key={message.id}
            content={message.content}
            sender={message.sender}
          />
        ))}
      </div>

      <div className="flex justify-center gap-2 p-4">
        {!isChatting && (
          <>
            <button
              type="button"
              className="rounded-lg border border-sky-500 p-2 text-sky-500 transition hover:bg-sky-500/10"
            >
              See chat history
            </button>

            <button
              type="button"
              className="rounded-lg border border-sky-500 p-2 text-sky-500 transition hover:bg-sky-500/10"
            >
              Start new chat
            </button>
          </>
        )}
      </div>

      <MessageField />
    </main>
  )
}
