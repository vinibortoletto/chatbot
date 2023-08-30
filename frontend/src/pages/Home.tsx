import { useContext, useEffect, useRef } from 'react'
import { Button, ChatHeader, MessageCard, MessageField } from '../components'
import { MessageContext } from '../contexts/MessageContext'

export default function Home() {
  const { chat, isChatting, goToChatHistory, startNewChat } =
    useContext(MessageContext)
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
            <Button text="See chat history" onClick={goToChatHistory} />
            <Button text="Start new chat" onClick={startNewChat} />
          </>
        )}
      </div>

      <MessageField />
    </main>
  )
}
