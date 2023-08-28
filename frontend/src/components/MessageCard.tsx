import React from 'react'

interface IProps {
  sender: 'company' | 'user'
  message: string
}

export default function MessageCard({ sender, message }: IProps) {
  const styles = {
    bg: sender === 'company' ? 'bg-slate-200' : 'bg-sky-500 text-white',
    position: sender === 'company' ? 'justify-start' : 'justify-end'
  }

  return (
    <div className={`flex ${styles.position}`}>
      <div className={`max-w-[70%] rounded-lg p-2 ${styles.bg} `}>
        {message}
      </div>
    </div>
  )
}