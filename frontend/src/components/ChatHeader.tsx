import React from 'react'
import profilePicture from '../assets/profile.jpg'

export default function ChatHeader() {
  return (
    <section className="grid grid-cols-[1fr,3fr] gap-4 border-b p-4">
      <div>
        <img
          className="h-20 w-20 rounded-full object-cover"
          src={profilePicture}
          alt="profile picture of a woman"
        />
      </div>

      <div>
        <h2 className="text-lg">Claire</h2>
        <h3 className="text-sm text-slate-500">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam,
          itaque.
        </h3>
      </div>
    </section>
  )
}
