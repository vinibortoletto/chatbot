import Header from 'components/Header'
import React from 'react'
import Routers from './routers/Routers'

export default function App() {
  return (
    <div className="relative h-[100vh]">
      <div className="absolute left-1/2 top-1/2 h-[90vh] w-96 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white shadow-lg">
        <Header />
        <Routers />
      </div>
    </div>
  )
}
