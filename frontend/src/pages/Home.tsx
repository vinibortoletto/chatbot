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
    <main>
      <ChatHeader />

      <div
        className={`flex ${
          isChatting ? 'h-[60vh]' : 'h-[52vh]'
        } flex-col gap-1 overflow-y-scroll p-4 `}
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

      <div>
        {!isChatting && (
          <div className="flex justify-center gap-2 py-2">
            <Button text="See chat history" onClick={goToChatHistory} />
            <Button text="Start new chat" onClick={startNewChat} />
          </div>
        )}

        <MessageField />
      </div>
    </main>
  )
}
