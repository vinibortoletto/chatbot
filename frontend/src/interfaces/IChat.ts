import IMessage from './IMessage'

export default interface IChat {
  id: string
  messages: IMessage[]
  createdAt: Date
  userId: string
}
