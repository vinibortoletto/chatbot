import React from 'react'
import ChatHeader from '../components/ChatHeader'
import ChatTime from '../components/ChatTime'
import MessageCard from '../components/MessageCard'
import MessageField from '../components/MessageField'

export default function Home() {
  return (
    <div className="rounded-b-lg">
      <ChatHeader />

      <div className="flex h-[22.4rem] flex-col gap-1 overflow-y-scroll p-4">
        <ChatTime />

        <MessageCard
          sender="company"
          message="Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias, earum."
        />
        <MessageCard sender="user" message="Lorem ipsum dolor sit amet." />
        <MessageCard
          sender="company"
          message="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur perferendis, at iure quos vero pariatur."
        />
        <MessageCard sender="user" message="Lorem, ipsum dolor." />
        <MessageCard sender="user" message="Lorem, ipsum dolor." />
        <MessageCard sender="user" message="Lorem, ipsum dolor." />
        <MessageCard sender="user" message="Lorem, ipsum dolor." />
        <MessageCard sender="user" message="Lorem, ipsum dolor." />
      </div>

      <MessageField />
    </div>
  )
}
