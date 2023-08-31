import { IChat, IMessage, IMessageContext, IUser } from '../interfaces'

export const defaultUserValues: IUser = {
  username: '',
  password: ''
}

export const defaultMessageContextValues: IMessageContext = {
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
  userCredentials: defaultUserValues,
  setChatHistory: () => {}
}

export const defaultChatValues: IChat = {
  id: '',
  messages: [] as IMessage[],
  createdAt: new Date(),
  endedAt: null,
  username: ''
}
