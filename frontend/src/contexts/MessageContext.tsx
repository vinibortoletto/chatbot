import React, {
  FormEvent,
  createContext,
  useCallback,
  useMemo,
  useState
} from 'react'
import { IMessage } from '../interfaces'
import { v4 as uuidv4 } from 'uuid'

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
        userId: 'user id',
        chatId: 'chat id'
      }

      setMessageList([...messageList, newMessage])
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

  return (
    <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
  )
}
