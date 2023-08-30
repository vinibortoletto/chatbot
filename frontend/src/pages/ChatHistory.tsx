import React, { useContext, useEffect } from 'react'
import { MessageContext } from '../contexts/MessageContext'
import { FaFileCsv } from 'react-icons/fa'

export default function ChatHistory() {
  const { chatHistory } = useContext(MessageContext)

  const formatDate = (date: Date): string => {
    const newDate = new Date(date)

    const day = newDate.getDate()
    const month = newDate.getMonth() + 1
    const year = newDate.getFullYear()
    const hour = newDate.getHours()
    const minute = newDate.getMinutes()

    return `${day}/${month}/${year} ${hour}:${minute}`
  }

  useEffect(() => {
    console.log(chatHistory)
  }, [chatHistory])

  return (
    <main>
      <div>
        <div className="flex flex-col justify-center gap-2 border-b p-4">
          <h1 className="text-xl font-bold">Chat history</h1>
          <h2 className="text-sm text-slate-500">
            Browse all your chat history.
          </h2>
        </div>

        <div className="p-4">
          <ul>
            {chatHistory.map((chat) => (
              <li
                className="flex justify-between rounded-lg p-2 odd:bg-slate-200"
                key={chat.id}
              >
                <span>{formatDate(chat.createdAt)}</span>

                <span>
                  <button type="button">
                    <FaFileCsv fill={'rgb(14 165 233)'} size={20} />
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  )
}
