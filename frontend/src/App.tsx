import React from 'react'
import Routers from './routers/Routers'
import { MessageProvider } from './contexts/MessageContext'
import { Header } from './components'

export default function App() {
  return (
    <MessageProvider>
      <div className="flex h-screen items-center">
        <div className="mx-auto w-full max-w-[24rem] rounded-lg bg-white shadow-lg">
          <Header />
          <Routers />
        </div>
      </div>
    </MessageProvider>
  )
}
