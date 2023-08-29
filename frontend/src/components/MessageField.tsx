import React, { useContext } from 'react'
import { IoMdSend } from 'react-icons/io'
import { MessageContext } from '../contexts/MessageContext'

export default function MessageField() {
  const { message, setMessage, createNewMessage, isChatting } =
    useContext(MessageContext)

  return (
    <form
      onSubmit={createNewMessage}
      className="flex w-full items-center justify-between gap-4 border-t px-4 py-2"
    >
      <div className="w-full">
        <label htmlFor="message-field" className="sr-only">
          Message
        </label>

        <input
          id="message-field"
          type="text"
          placeholder="Type your message"
          className="w-full rounded-full border border-slate-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:bg-slate-200"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          disabled={!isChatting}
        />
      </div>

      <div>
        <button
          type="submit"
          className="flex items-center"
          disabled={!isChatting}
        >
          <IoMdSend
            fill={isChatting ? 'rgb(14 165 233)' : ' rgb(148 163 184)'}
            size={25}
          />
        </button>
      </div>
    </form>
  )
}
