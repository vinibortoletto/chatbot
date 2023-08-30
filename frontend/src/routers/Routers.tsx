import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { ChatHistory, Home } from '../pages'

export default function Routers() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chat-history" element={<ChatHistory />} />
    </Routes>
  )
}
