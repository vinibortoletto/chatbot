import React, {
  FormEvent,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'
import { v4 as uuidv4 } from 'uuid'
import {
  IChat,
  IChatResponse,
  IMessage,
  IMessageContext,
  IUser
} from '../interfaces'
import { TSender } from '../types'
import { deepCopyObject, handleLocalStorage } from '../utils'
import {
  defaultChatValues,
  defaultMessageContextValues,
  defaultUserValues
} from '../utils/defaultValues'
import axios from 'axios'

interface IProps {
  children: React.ReactNode
}

export const MessageContext = createContext(defaultMessageContextValues)

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
    async (newChat: IChat): Promise<void> => {
      newChat.messages.push(
        createMessageObject('company', 'Goodbye, have a nice day!'),
        createMessageObject(
          'company',
          'If you want to talk again, you can create a new chat!'
        )
      )

      newChat.endedAt = new Date()
      newChat.username = userCredentials.username
      setChatHistory([...chatHistory, newChat])

      handleLocalStorage.set('chatHistory', [
        ...chatHistory,
        newChat
      ] as IChat[])

      setIsChatting(false)
      saveChat(newChat)

      try {
        await axios.post('http://localhost:3001/chats', {
          created_at: newChat.createdAt,
          ended_at: newChat.endedAt,
          messages: JSON.stringify(newChat.messages),
          username: newChat.username
        })
      } catch (error) {
        console.log(error)
      }

      return
    },
    [chatHistory, createMessageObject, userCredentials.username]
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

  const setUsername = useCallback(
    (newUserCredentials: IUser): void => {
      newUserCredentials.username = message
      setUserCredentials(newUserCredentials)
      setChat({ ...chat, username: message })
      handleLocalStorage.set('user', newUserCredentials)
    },
    [chat, message]
  )

  const setUserPassword = useCallback(
    (newUserCredentials: IUser): void => {
      newUserCredentials.password = message
      setUserCredentials(newUserCredentials)
      handleLocalStorage.set('user', newUserCredentials)
    },
    [message]
  )

  const createNewMessage = useCallback(
    async (event: FormEvent<HTMLFormElement>): Promise<void> => {
      event.preventDefault()

      if (message === '') return

      const newChat = deepCopyObject(chat)
      addNewMessageFromUser(newChat)

      if (isUserSayingGoodbye()) {
        await handleGoodByeMessage(newChat)
        return
      }

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

      const newUserCredentials = { ...userCredentials }

      if (!userCredentials.username) {
        setUsername(newUserCredentials)

        newChat.messages.push(
          createMessageObject('company', companyMessages.askPassword)
        )
      } else {
        setUserPassword(newUserCredentials)

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
      userCredentials,
      isAskingForUsername,
      askForUsername,
      loanMessagesOptions,
      createMessageObject,
      companyMessages.wrongMessage,
      companyMessages.askPassword,
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
      username: ''
    }

    saveChat(newChat)
  }, [])

  const saveChat = (newChat: IChat): void => {
    setChat(newChat)
    handleLocalStorage.set('chat', newChat)
  }

  const startNewChat = useCallback((): void => {
    setIsChatting(true)
    setIsAskingForUsername(false)
    setIsUserAskingAboutLoan(false)

    setUserCredentials(defaultUserValues)
    handleLocalStorage.set('user', defaultUserValues)
    createNewChat()
  }, [createNewChat])

  const getLocalChatHistory = async (): Promise<void> => {
    const localChatHistory = handleLocalStorage.get('chatHistory') as IChat[]

    if (localChatHistory) {
      setChatHistory(localChatHistory)
      return
    }

    try {
      const { data } = await axios.get('http://localhost:3001/chats')

      if (!data) return

      const newChatHistory = [] as IChat[]

      data.forEach((chat: IChatResponse) => {
        newChatHistory.push({
          id: String(chat.id),
          messages: JSON.parse(chat.messages),
          createdAt: chat.created_at,
          endedAt: chat.ended_at,
          username: chat.username
        })
      })

      setChatHistory(newChatHistory as unknown as IChat[])

      handleLocalStorage.set('chatHistory', data as unknown as IChat[])
    } catch (error) {
      console.log(error)
    }
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

  const value: IMessageContext = useMemo(
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
      userCredentials,
      setChatHistory
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
      userCredentials,
      setChatHistory
    ]
  )

  return (
    <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
  )
}
