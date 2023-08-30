import React from 'react'
import Routers from './routers/Routers'
import { MessageProvider } from './contexts/MessageContext'
import { Header } from './components'

export default function App() {
  return (
    <MessageProvider>
      <div className="relative h-[100vh]">
        <div className="absolute left-1/2 top-1/2 h-[96vh] w-full max-w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white shadow-lg">
          <Header />
          <Routers />
        </div>
      </div>
    </MessageProvider>
  )
}
