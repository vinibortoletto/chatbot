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

  const createNewMessage = useCallback(
    (event: FormEvent<HTMLFormElement>): void => {
      event.preventDefault()

      const newMessage: IMessage = {
        id: uuidv4(),
        content: message,
        createdAt: new Date(),
        sender: 'user',
        userId: 'user id',
        chatId: 'chat id'
      }

      const newMessageList = [...messageList, newMessage]
      setMessageList(newMessageList)
      handleLocalStorage.set('messageList', newMessageList)
      setMessage('')
    },
    [message, messageList]
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
