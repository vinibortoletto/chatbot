import React, {
  FormEvent,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'
import { IMessage } from '../interfaces'
import { v4 as uuidv4 } from 'uuid'
import { handleLocalStorage } from '../utils'

interface IProps {
  children: React.ReactNode
}

interface IContext {
  message: string
  setMessage: (message: string) => void
  messageList: IMessage[]
  setMessageList: (messageList: IMessage[]) => void
  createNewMessage: (event: FormEvent<HTMLFormElement>) => void
}

const defaultValues: IContext = {
  message: '',
  setMessage: () => {},
  messageList: [] as IMessage[],
  setMessageList: () => {},
  createNewMessage: () => {}
}

export const MessageContext = createContext(defaultValues)

export function MessageProvider({ children }: IProps) {
  const [message, setMessage] = useState('')
  const [messageList, setMessageList] = useState<IMessage[]>([])
  const triggerWordList = ['hello', 'goodbye', 'good', 'i want']

  const createNewMessage = useCallback(
    (event: FormEvent<HTMLFormElement>): void => {
      const chatId = messageList[0].chatId || uuidv4()
      event.preventDefault()

      const newMessage: IMessage = {
        id: uuidv4(),
        content: message,
        createdAt: new Date(),
        sender: 'user',
        userId: 'user id',
        chatId
      }

      const newMessageList = [...messageList, newMessage]

      const hasTriggerWord = triggerWordList.some((word) =>
        newMessage.content.toLowerCase().includes(word)
      )

      if (hasTriggerWord) {
        newMessageList.push({
          id: uuidv4(),
          content: `Before we continue, what should I call you?`,
          createdAt: new Date(),
          sender: 'company',
          userId: null,
          chatId
        })
      } else {
        newMessageList.push({
          id: uuidv4(),
          content: `I'm sorry, but I don't understand.`,
          createdAt: new Date(),
          sender: 'company',
          userId: null,
          chatId
        })
      }

      setMessageList(newMessageList)
      setMessage('')
      handleLocalStorage.set('messageList', newMessageList)
    },
    [message, setMessage]
  )

  const value: IContext = useMemo(
    () => ({
      message,
      setMessage,
      messageList,
      setMessageList,
      createNewMessage
    }),
    [message, setMessage, messageList, setMessageList, createNewMessage]
  )

  const createWelcomeMessage = useCallback((): void => {
    const welcomeMessage: IMessage = {
      id: uuidv4(),
      content: `Hello, I'm Claire! How can I help you today?`,
      createdAt: new Date(),
      sender: 'company',
      userId: null,
      chatId: uuidv4()
    }

    const newMessageList = [...messageList, welcomeMessage]
    setMessageList(newMessageList)
    handleLocalStorage.set('messageList', newMessageList)
  }, [])

  useEffect(() => {
    const localMessageList = handleLocalStorage.get('messageList') as IMessage[]

    if (localMessageList) {
      setMessageList(localMessageList)
      return
    }

    createWelcomeMessage()
  }, [])

  return (
    <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
  )
}
