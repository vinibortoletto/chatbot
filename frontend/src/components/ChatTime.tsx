import React from 'react'

export default function ChatTime() {
  const getCurrentBrazilianTime = (): string => {
    const date = new Date()
    const hour = date.getHours()
    const minute = date.getMinutes()

    return `${hour}:${minute}`
  }

  return (
    <div className="mt-4 flex justify-center gap-2 text-sm text-slate-500">
      <span>Today</span>
      <span>{getCurrentBrazilianTime()}</span>
    </div>
  )
}
