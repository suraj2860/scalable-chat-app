'use client'
import { SessionProvider } from 'next-auth/react'
import { SocketProvider } from './context/SocketProvider'

type Props = {
  children?: React.ReactNode
}

export const Providers = ({ children }: Props) => {
  return (
    <SessionProvider>
      <SocketProvider>
        {children}
      </SocketProvider>
    </SessionProvider>
  )
}