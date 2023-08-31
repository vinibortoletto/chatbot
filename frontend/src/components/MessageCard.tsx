import React, { useContext } from 'react'
import { MessageContext } from '../contexts/MessageContext'

interface IProps {
  sender: 'company' | 'user'
  content: string
  isLoanMessage?: boolean
}

export default function MessageCard({
  sender,
  content,
  isLoanMessage
}: IProps) {
  const styles = {
    bg: sender === 'company' ? 'bg-slate-200' : 'bg-sky-500 text-white',
    position: sender === 'company' ? 'justify-start' : 'justify-end'
  }

  const { selectLoanOption } = useContext(MessageContext)

  const extractLinkFromContent = (content: string): string => {
    const pattern = /https?:\/\/\S+/
    const match = content.match(pattern)
    return match ? match[0] : ''
  }

  return (
    <div className={`flex ${styles.position}`}>
      {!isLoanMessage ? (
        <div className={`max-w-[70%] rounded-lg p-2 ${styles.bg} `}>
          {content.includes('https') ? (
            <a
              href={extractLinkFromContent(content)}
              target="_blank"
              rel="noreferrer"
            >
              <span>More information </span>
              <span className="text-sky-600 hover:underline ">here.</span>
            </a>
          ) : (
            content
          )}
        </div>
      ) : (
        <button
          type="button"
          className="max-w-[70%] rounded-lg bg-emerald-200 p-2 text-left transition hover:bg-emerald-200/70"
          onClick={() => selectLoanOption(content)}
        >
          {content}
        </button>
      )}
    </div>
  )
}
