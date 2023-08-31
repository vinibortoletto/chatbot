import React, {
  FormEvent,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'
import { v4 as uuidv4 } from 'uuid'
import { IChat, IMessage, IUser } from '../interfaces'
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
  isUserAskingAboutLoan: boolean
  loanMessagesOptions: string[]
  selectLoanOption: (option: string) => void
  userCredentials: IUser
}

const defaultUserValues: IUser = {
  username: '',
  password: ''
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
  chatHistory: [],
  isUserAskingAboutLoan: false,
  loanMessagesOptions: [],
  selectLoanOption: () => {},
  userCredentials: defaultUserValues
}

const defaultChatValues: IChat = {
  id: '',
  messages: [] as IMessage[],
  createdAt: new Date(),
  endedAt: null,
  userId: ''
}

export const MessageContext = createContext(defaultValues)

export function MessageProvider({ children }: IProps) {
  const [message, setMessage] = useState('')
  const [chat, setChat] = useState<IChat>(defaultChatValues)
  const [chatHistory, setChatHistory] = useState<IChat[]>([])
  const [isChatting, setIsChatting] = useState(true)
  const [userCredentials, setUserCredentials] = useState(defaultUserValues)
  const [isAskingForUsername, setIsAskingForUsername] = useState(false)
  const [isUserAskingAboutLoan, setIsUserAskingAboutLoan] = useState(false)

  const loanMessagesOptions = useMemo(
    () => [
      '1. Do you want to apply for a loan?',
      '2. Loan conditions',
      '3. Help'
    ],
    []
  )
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

      newChat.endedAt = new Date()
      setChatHistory([...chatHistory, newChat])

      handleLocalStorage.set('chatHistory', [
        ...chatHistory,
        newChat
      ] as IChat[])

      setIsChatting(false)
      saveChat(newChat)
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

      saveChat(newChat)
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

    handleLocalStorage.set('user', userCredentials)
  }, [message, userCredentials])

  const setUserPassword = useCallback((): void => {
    setUserCredentials({
      ...userCredentials,
      password: message
    })

    handleLocalStorage.set('user', userCredentials)
  }, [message, userCredentials])

  const createNewMessage = useCallback(
    (event: FormEvent<HTMLFormElement>): void => {
      event.preventDefault()

      if (message === '') return

      const newChat = deepCopyObject(chat)
      addNewMessageFromUser(newChat)

      if (isUserSayingGoodbye()) return handleGoodByeMessage(newChat)

      if (userCredentials.username && userCredentials.password) {
        const newIsUserAskingAboutLoan = message.split(' ').some((word) => {
          if (word.toLowerCase() === 'loan') {
            return true
          }
        })

        setIsUserAskingAboutLoan(newIsUserAskingAboutLoan)

        if (!newIsUserAskingAboutLoan) {
          newChat.messages.push(
            createMessageObject('company', companyMessages.wrongMessage)
          )

          saveChat(newChat)
          return
        }

        loanMessagesOptions.forEach((option) => {
          newChat.messages.push(createMessageObject('company', option))
        })

        saveChat(newChat)
        return
      }

      if (!isAskingForUsername) return askForUsername(newChat)

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

      saveChat(newChat)
    },
    [
      message,
      chat,
      addNewMessageFromUser,
      isUserSayingGoodbye,
      handleGoodByeMessage,
      userCredentials.username,
      userCredentials.password,
      isAskingForUsername,
      askForUsername,
      createMessageObject,
      companyMessages.wrongMessage,
      companyMessages.askPassword,
      loanMessagesOptions,
      setUsername,
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
      endedAt: null,
      userId: 'user id'
    }

    saveChat(newChat)
  }, [])

  const saveChat = (newChat: IChat): void => {
    setChat(newChat)
    handleLocalStorage.set('chat', newChat)
  }

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

  const getLocalUserCredentials = (): void => {
    const localUserCredentials = handleLocalStorage.get('user') as IUser

    if (localUserCredentials) {
      setUserCredentials(localUserCredentials)
      return
    }

    handleLocalStorage.set('user', {})
  }

  useEffect(() => {
    getLocalChatHistory()
    getLocalUserCredentials()

    const localChat = handleLocalStorage.get('chat') as IChat

    if (localChat) {
      setChat(localChat)
      return
    }

    createNewChat()
  }, [createNewChat])

  const selectLoanOption = useCallback(
    (option: string): void => {
      const newChat = deepCopyObject(chat)

      if (option.includes('1')) {
        newChat.messages.push(
          createMessageObject(
            'company',
            'When applying for a loan, ensure you gather all necessary documents, accurately complete forms, and highlight your financial stability. A well-prepared application increases your chances of approval.'
          ),
          createMessageObject('company', 'https://lexartlabs.com/')
        )

        saveChat(newChat)
        return
      }

      if (option.includes('2')) {
        newChat.messages.push(
          createMessageObject(
            'company',
            'Loan conditions encompass interest rates, repayment periods, and collateral requirements. Lenders set these terms, tailored to borrower creditworthiness. Clear understanding of conditions is crucial before committing to any loan agreement.'
          ),
          createMessageObject('company', 'https://lexartlabs.com/')
        )

        saveChat(newChat)
        return
      }

      if (option.includes('3')) {
        newChat.messages.push(
          createMessageObject(
            'company',
            `Need assistance with loans? We're here to guide you. Explore options, understand terms, and make informed decisions. Achieve your financial goals with our expert support.`
          ),
          createMessageObject('company', 'https://lexartlabs.com/')
        )

        saveChat(newChat)
        return
      }
    },
    [chat, createMessageObject]
  )

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
      chatHistory,
      isUserAskingAboutLoan,
      loanMessagesOptions,
      selectLoanOption,
      userCredentials
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
      chatHistory,
      isUserAskingAboutLoan,
      loanMessagesOptions,
      selectLoanOption,
      userCredentials
    ]
  )

  return (
    <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
  )
}
