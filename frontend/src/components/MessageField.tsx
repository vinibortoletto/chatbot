import React from 'react'
import { IoMdSend } from 'react-icons/io'

export default function MessageField() {
  return (
    <div className="absolute bottom-0 my-2 flex w-full items-center justify-between gap-4 border-t  px-4 py-2">
      <div className="w-full">
        <label htmlFor="message-field" className="sr-only">
          Message
        </label>

        <input
          id="message-field"
          type="text"
          placeholder="Type your message"
          className="w-full rounded-full border border-slate-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
      </div>

      <div>
        <button type="button" className="flex items-center">
          <IoMdSend fill="rgb(14 165 233)" size={25} />
        </button>
      </div>
    </div>
  )
}
