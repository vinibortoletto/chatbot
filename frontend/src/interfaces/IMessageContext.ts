import { FormEvent } from 'react'
import IChat from './IChat'
import IUser from './IUser'

export default interface IMessageContext {
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
