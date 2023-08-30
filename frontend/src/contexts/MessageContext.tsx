import React, {
  FormEvent,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'
import { v4 as uuidv4 } from 'uuid'
import { IChat, IMessage } from '../interfaces'
import { TSender } from '../types'
import { deepCopyObject, handleLocalStorage } from '../utils'
import { useNavigate } from 'react-router-dom'

interface IProps {
  children: React.ReactNode
}

interface IContext {
  message: string
  chat: IChat
  isChatting: boolean
  setMessage: (message: string) => void
  createNewMessage: (event: FormEvent<HTMLFormElement>) => void
  setIsChatting: (isChatting: boolean) => void
  setChat: (chat: IChat) => void
  goToChatHistory: () => void
}

const defaultValues: IContext = {
  message: '',
  chat: {} as IChat,
  isChatting: true,
  setMessage: () => {},
  createNewMessage: () => {},
  setIsChatting: () => {},
  setChat: () => {},
  goToChatHistory: () => {}
}

const defaultChatValues: IChat = {
  id: '',
  messages: [] as IMessage[],
  createdAt: new Date(),
  userId: ''
}

export const MessageContext = createContext(defaultValues)

export function MessageProvider({ children }: IProps) {
  const navigate = useNavigate()

  const [message, setMessage] = useState('')
  const [chat, setChat] = useState<IChat>(defaultChatValues)
  const [chatHistory, setChatHistory] = useState<IChat[]>([])
  const [isChatting, setIsChatting] = useState(true)

  const triggerWords = useMemo(() => ['hello', 'good', 'goodbye', 'i want'], [])

  const companyMessages = useMemo(
    () => ({
      askUsername: 'Before we continue, please enter your username.',
      askPassword: 'Great! Now please enter your password.',
      wrongMessage: `I'm sorry, but I don't understand.`
    }),
    []
  )

  const createMessageObject = useCallback(
    (sender: TSender, content: string): IMessage => {
      return {
        id: uuidv4(),
        content,
        createdAt: new Date(),
        sender
      }
    },
    []
  )

  const handleGoodByeMessage = useCallback(
    (newChat: IChat) => {
      newChat.messages.push(
        createMessageObject('company', 'Goodbye, have a nice day!'),
        createMessageObject(
          'company',
          'If you want to talk again, you can create a new chat!'
        )
      )

      setChatHistory([...chatHistory, newChat])

      handleLocalStorage.set('chatHistory', [
        ...chatHistory,
        newChat
      ] as IChat[])

      setIsChatting(false)
      setChat(newChat)
      handleLocalStorage.remove('chat')
      return
    },
    [chatHistory, createMessageObject]
  )

  const hasTriggerWord = useCallback((): boolean => {
    return triggerWords.some((triggerWord) => {
      if (message.toLowerCase().includes('i want')) {
        return true
      }

      return message.split(' ').some((messageWord) => {
        if (messageWord.toLowerCase() === triggerWord) {
          return true
        }
      })
    })
  }, [message, triggerWords])

  const createNewMessage = useCallback(
    (event: FormEvent<HTMLFormElement>): void => {
      event.preventDefault()
      const newChat = deepCopyObject(chat)

      newChat.messages.push(createMessageObject('user', message))
      setMessage('')

      const hasGoodbye = message.split(' ').some((messageWord) => {
        if (messageWord.toLowerCase().includes('goodbye')) {
          return true
        }
      })

      if (hasGoodbye) return handleGoodByeMessage(newChat)

      if (hasTriggerWord()) {
        newChat.messages.push(
          createMessageObject('company', companyMessages.askUsername)
        )
      } else {
        newChat.messages.push(
          createMessageObject('company', companyMessages.wrongMessage)
        )
      }

      setChat(newChat)
      handleLocalStorage.set('chat', newChat)
    },
    [
      chat,
      companyMessages.askUsername,
      companyMessages.wrongMessage,
      createMessageObject,
      handleGoodByeMessage,
      hasTriggerWord,
      message
    ]
  )

  const createNewChat = useCallback((): void => {
    const welcomeMessage: IMessage = {
      id: uuidv4(),
      content: `Hello, I'm Claire! How can I help you today?`,
      createdAt: new Date(),
      sender: 'company'
    }

    const newChat = {
      id: uuidv4(),
      messages: [welcomeMessage],
      createdAt: new Date(),
      userId: 'user id'
    }

    setChat(newChat)
    handleLocalStorage.set('chat', newChat)
  }, [])

  const goToChatHistory = useCallback(() => {
    navigate('/chat-history')

    setChat({
      id: '',
      messages: [] as IMessage[],
      createdAt: new Date(),
      userId: ''
    })

    setIsChatting(true)
  }, [navigate])

  useEffect(() => {
    const localChat = handleLocalStorage.get('chat') as IChat

    if (localChat) {
      setChat(localChat)
      return
    }

    createNewChat()
  }, [createNewChat])

  const value: IContext = useMemo(
    () => ({
      message,
      chat,
      isChatting,
      setMessage,
      createNewMessage,
      setIsChatting,
      setChat,
      goToChatHistory
    }),
    [
      message,
      chat,
      isChatting,
      setMessage,
      createNewMessage,
      setIsChatting,
      setChat,
      goToChatHistory
    ]
  )

  return (
    <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
  )
}
