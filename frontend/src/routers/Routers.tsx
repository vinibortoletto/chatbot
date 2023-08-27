import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../pages/Home'
import ChatHistory from '../pages/ChatHistory'

export default function Routers() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chat-history" element={<ChatHistory />} />
    </Routes>
  )
}
