import React from 'react'
import Image from 'next/image';
import avatar from '../assets/avatar.jpg';

interface user {
  id: string;
  username: string;
  email: string;
  profile_picture: string;
  created_at: string;
  updated_at: string;
}

interface props {
  user: user;
  joinChatroom: (user: user) => Promise<void>
}

export const UserCard = (props: props) => {
  return (
    <div
      onClick={() => props.joinChatroom(props.user)}
      className='flex items-center border bg-gray-900  border-white w-80 h-16 space-x-4 p-2 hover:cursor-pointer hover:bg-white hover:text-black dark:hover:bg-white dark:hover:text-black'>
        <Image src={props.user.profile_picture || avatar} alt={props.user.username} className='h-12 w-12 rounded-full object-cover border border-black' />
      <h1>{props.user.username}</h1>
    </div>
  )
}
