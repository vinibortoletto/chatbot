import Header from 'components/Header'
import React from 'react'
import Routers from './routers/Routers'

export default function App() {
  return (
    <div>
      <div className="m-4 mx-auto w-96 rounded-lg shadow-lg">
        <Header />
        <Routers />
      </div>
    </div>
  )
}
