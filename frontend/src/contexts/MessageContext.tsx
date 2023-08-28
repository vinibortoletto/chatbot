import React, {
  FormEvent,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'
import { IChat, IMessage } from '../interfaces'
import { v4 as uuidv4 } from 'uuid'
import { deepCopyObject, handleLocalStorage } from '../utils'
import { TSender } from '../types'

interface IProps {
  children: React.ReactNode
}

interface IContext {
  message: string
  chat: IChat
  setMessage: (message: string) => void
  createNewMessage: (event: FormEvent<HTMLFormElement>) => void
}

const defaultValues: IContext = {
  message: '',
  chat: {} as IChat,
  setMessage: () => {},
  createNewMessage: () => {}
}

const defaultChatValues: IChat = {
  id: '',
  messages: [] as IMessage[],
  createdAt: new Date(),
  userId: ''
}

export const MessageContext = createContext(defaultValues)

export function MessageProvider({ children }: IProps) {
  const [message, setMessage] = useState('')
  const [chat, setChat] = useState<IChat>(defaultChatValues)

  const triggerWords = useMemo(() => ['hello', 'goodbye', 'good', 'i want'], [])

  const companyMessages = useMemo(
    () => ({
      askUsername: 'Before we continue, please enter your username.',
      askPassword: 'Great! Now please enter your password.',
      wrongMessage: `I'm sorry, but I don't understand.`
    }),
    []
  )

  const createMessageObject = (sender: TSender, content: string): IMessage => {
    return {
      id: uuidv4(),
      content,
      createdAt: new Date(),
      sender
    }
  }

  const createNewMessage = useCallback(
    (event: FormEvent<HTMLFormElement>): void => {
      event.preventDefault()
      const newChat = deepCopyObject(chat)

      newChat.messages.push(createMessageObject('user', message))
      setMessage('')

      const hasTriggerWord = triggerWords.some((word) =>
        message.toLowerCase().includes(word)
      )

      if (hasTriggerWord) {
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
    [chat, companyMessages, message, triggerWords]
  )

  const value: IContext = useMemo(
    () => ({
      message,
      setMessage,
      createNewMessage,
      chat
    }),
    [message, setMessage, createNewMessage, chat]
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

  useEffect(() => {
    const localChat = handleLocalStorage.get('chat') as IChat

    if (localChat) {
      setChat(localChat)
      return
    }

    createNewChat()
  }, [createNewChat])

  return (
    <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
  )
}
