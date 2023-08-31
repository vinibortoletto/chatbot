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
  startNewChat: () => void
  chatHistory: IChat[]
}

const defaultValues: IContext = {
  message: '',
  chat: {} as IChat,
  isChatting: true,
  setMessage: () => {},
  createNewMessage: () => {},
  setIsChatting: () => {},
  setChat: () => {},
  startNewChat: () => {},
  chatHistory: []
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
  const [chatHistory, setChatHistory] = useState<IChat[]>([])
  const [isChatting, setIsChatting] = useState(true)
  const [userCredentials, setUserCredentials] = useState({
    username: '',
    password: ''
  })
  const [isAskingForUsername, setIsAskingForUsername] = useState(false)

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

  const isUserSayingGoodbye = useCallback((): boolean => {
    return message.split(' ').some((messageWord) => {
      if (messageWord.toLowerCase().includes('goodbye')) {
        return true
      }
    })
  }, [message])

  const addNewMessageFromUser = useCallback(
    (newChat: IChat): void => {
      newChat.messages.push(createMessageObject('user', message))
      setMessage('')
    },
    [createMessageObject, message]
  )

  const askForUsername = useCallback(
    (newChat: IChat): void => {
      if (hasTriggerWord()) {
        newChat.messages.push(
          createMessageObject('company', companyMessages.askUsername)
        )

        setIsAskingForUsername(true)
      } else {
        newChat.messages.push(
          createMessageObject('company', companyMessages.wrongMessage)
        )
      }
    },
    [
      companyMessages.askUsername,
      companyMessages.wrongMessage,
      createMessageObject,
      hasTriggerWord
    ]
  )

  const setUsername = useCallback((): void => {
    setUserCredentials({
      ...userCredentials,
      username: message
    })
  }, [message, userCredentials])

  const setUserPassword = useCallback((): void => {
    setUserCredentials({
      ...userCredentials,
      password: message
    })
  }, [message, userCredentials])

  const createNewMessage = useCallback(
    (event: FormEvent<HTMLFormElement>): void => {
      event.preventDefault()

      if (message === '') return

      const newChat = deepCopyObject(chat)
      addNewMessageFromUser(newChat)

      if (isUserSayingGoodbye()) return handleGoodByeMessage(newChat)

      if (!isAskingForUsername) askForUsername(newChat)

      if (!userCredentials.username) {
        setUsername()
        newChat.messages.push(
          createMessageObject('company', companyMessages.askPassword)
        )
      } else {
        setUserPassword()
        newChat.messages.push(
          createMessageObject(
            'company',
            `All set ${userCredentials.username}! How can I help you today?`
          )
        )

        setIsAskingForUsername(false)
      }

      setChat(newChat)
      handleLocalStorage.set('chat', newChat)
    },
    [
      message,
      chat,
      addNewMessageFromUser,
      isUserSayingGoodbye,
      handleGoodByeMessage,
      isAskingForUsername,
      askForUsername,
      userCredentials.username,
      setUsername,
      createMessageObject,
      companyMessages.askPassword,
      setUserPassword
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

  const startNewChat = useCallback((): void => {
    setIsChatting(true)
    createNewChat()
  }, [createNewChat])

  const getLocalChatHistory = (): void => {
    const localChatHistory = handleLocalStorage.get('chatHistory') as IChat[]

    if (localChatHistory) {
      setChatHistory(localChatHistory)
      return
    }

    handleLocalStorage.set('chatHistory', [] as IChat[])
  }

  useEffect(() => {
    getLocalChatHistory()

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
      startNewChat,
      chatHistory
    }),
    [
      message,
      chat,
      isChatting,
      setMessage,
      createNewMessage,
      setIsChatting,
      setChat,
      startNewChat,
      chatHistory
    ]
  )

  return (
    <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
  )
}
