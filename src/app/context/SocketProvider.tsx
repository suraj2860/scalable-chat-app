"use client";
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
}

interface SocketContextType {
  sendMessage: (chatroomId: string, message: string, senderId: string) => void;
  joinRoom: (chatroomId: string) => void;
  messages: Message[];
}

const SocketContext = createContext<SocketContextType | null>(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const newSocket = io('http://localhost:3000'); // Replace with your socket server URL
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to socket server');
    });

    newSocket.on('receiveMessage', (newMessage: Message) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    newSocket.on('errorMessage', (error) => {
      console.error('Socket error:', error);
      // Handle error (e.g., show a notification to the user)
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const sendMessage = useCallback((chatroomId: string, message: string, senderId: string) => {
    if (socket) {
      socket.emit('sendMessage', { chatroomId, message, senderId });
    }
  }, [socket]);

  const joinRoom = useCallback((chatroomId: string) => {
    if (socket) {
      socket.emit('joinRoom', chatroomId);
    }
  }, [socket]);

  return (
    <SocketContext.Provider value={{ sendMessage, joinRoom, messages }}>
      {children}
    </SocketContext.Provider>
  );
};