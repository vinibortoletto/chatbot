export default interface IMessage {
  id: string
  content: string
  createdAt: Date
  sender: 'company' | 'user'
  userId: string | null
  chatId: string
}
