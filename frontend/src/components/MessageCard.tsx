import React from 'react'

interface IProps {
  sender: 'company' | 'user'
}

export default function MessageCard({ sender }: IProps) {
  const styles = {
    bg: sender === 'company' ? 'bg-slate-200' : 'bg-sky-500 text-white',
    position: sender === 'company' ? 'justify-start' : 'justify-end'
  }

  return (
    <div className={`flex ${styles.position}`}>
      <div className={`w-2/3 rounded-lg p-2 ${styles.bg}`}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque,
        doloremque.
      </div>
    </div>
  )
}
