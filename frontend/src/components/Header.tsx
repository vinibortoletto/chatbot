import React from 'react'
import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="flex justify-between bg-sky-700 p-4 text-slate-100">
      <Link to="/">
        <h1 className="font-bold uppercase">chat bot</h1>
      </Link>

      <nav>
        <ul className="flex gap-4">
          <Link to="/">
            <li className="cursor-pointer hover:underline">New chat</li>
          </Link>

          <Link to="/chat-history">
            <li className="cursor-pointer hover:underline">Chat history</li>
          </Link>
        </ul>
      </nav>
    </header>
  )
}
