import React from 'react'

interface IProps {
  text: string
  onClick?: () => void
  className?: string
}

export default function Button({ text, onClick, className }: IProps) {
  return (
    <button
      type="button"
      className={`rounded-lg border border-sky-500 bg-white p-2 text-sky-500 transition hover:bg-sky-50 ${className}`}
      onClick={onClick}
    >
      {text}
    </button>
  )
}
