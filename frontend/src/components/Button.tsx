import React from 'react'

interface IProps {
  text: string
  onClick?: () => void
}

export default function Button({ text, onClick }: IProps) {
  return (
    <button
      type="button"
      className="rounded-lg border border-sky-500 p-2 text-sky-500 transition hover:bg-sky-500/10"
      onClick={onClick}
    >
      {text}
    </button>
  )
}
