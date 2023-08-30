import React, { useContext, useEffect } from 'react'
import { MessageContext } from '../contexts/MessageContext'
import { FaFileCsv } from 'react-icons/fa'
import { Button } from '../components'
import { useNavigate } from 'react-router-dom'

export default function ChatHistory() {
  const { chatHistory, startNewChat } = useContext(MessageContext)
  const navigate = useNavigate()

  const formatDate = (date: Date): string => {
    const newDate = new Date(date)

    const day = newDate.getDate()
    const month = newDate.getMonth() + 1
    const year = newDate.getFullYear()
    const hour = newDate.getHours()
    const minute = newDate.getMinutes()

    return `${day}/${month}/${year} ${hour}:${minute}`
  }

  return (
    <main>
      <div>
        <div className="flex flex-col justify-center gap-2 border-b p-4">
          <h1 className="text-xl font-bold">Chat history</h1>
          <h2 className="text-sm text-slate-500">
            Browse all your chat history.
          </h2>
        </div>

        <div className="h-[71vh] overflow-y-scroll  p-4">
          {chatHistory.length === 0 && (
            <div className="text-center">
              <h3 className="text-lg font-bold">No chat history</h3>
              <h4 className="text-slate-500">
                You have not ended any chat yet.
              </h4>

              <Button
                className="mt-6"
                text="Start new chat"
                onClick={() => {
                  navigate('/')
                  startNewChat()
                }}
              />
            </div>
          )}

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
