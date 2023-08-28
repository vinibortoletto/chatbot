import React from 'react'
import profilePicture from '../assets/profile.jpg'

export default function ChatHeader() {
  return (
    <section className="flex items-center gap-4 border-b p-4">
      <div>
        <div className="h-20 w-20 self-start overflow-hidden rounded-full">
          <img
            className="h-full w-full object-cover"
            src={profilePicture}
            alt="profile picture of a woman"
          />
        </div>
      </div>

      <div>
        <h2 className="text-lg">Claire</h2>
        <h3 className="text-sm text-slate-500">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </h3>
      </div>
    </section>
  )
}
