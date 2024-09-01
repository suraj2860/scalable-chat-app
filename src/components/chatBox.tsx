import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faPhone, faPlus, faVideo } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import avatar from '../assets/avatar.jpg';
import SenderMessageBox from './senderMessageBox';
import ReceiverMessageBox from './receiverMessageBox';
import axios from 'axios';
import { useSocket } from '../app/context/SocketProvider';
import DefaultChatBox from './defaultChatBox';

interface Message {
    id: string;
    content: string;
    sender_id: string;
    created_at: string;
}

const ChatBox = ({ chatroomId, currentUser, selectedUser }: { chatroomId: string; currentUser: any; selectedUser: any }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [newMessage, setNewMessage] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);
    const { sendMessage, joinRoom, messages: socketMessages } = useSocket();
    const [isLoading, setIsLoading] = useState(true);

    const getConversation = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`/api/messages/${chatroomId}`);
            if (response.status === 200) {
                setMessages(response.data.data);
            }
        } catch (error: any) {
            console.error(error?.message);
        } finally {
            setIsLoading(false);
        }
    }, [chatroomId]);

    const handleSendMessage = useCallback(() => {
        if (newMessage.trim() && currentUser?.id) {
            sendMessage(chatroomId, newMessage, currentUser.id);
            setNewMessage("");
        }
    }, [newMessage, chatroomId, currentUser?.id, sendMessage]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleSendMessage();
    }, [handleSendMessage]);

    useEffect(() => {
        getConversation();
        if (chatroomId) {
            joinRoom(chatroomId);
        }
    }, [chatroomId, getConversation, joinRoom]);

    useEffect(() => {
        setMessages((prevMessages) => [...prevMessages, ...socketMessages]);
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [socketMessages]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const renderedMessages = useMemo(() => messages.map((message) => (
        <div key={message.id} className={`flex ${message.sender_id === currentUser?.id ? 'justify-end' : 'justify-start'}`}>
            {message.sender_id === currentUser?.id 
                ? <SenderMessageBox message={message.content} />
                : <ReceiverMessageBox message={message.content} />
            }
        </div>
    )), [messages, currentUser?.id]);

    if (!selectedUser) {
        return <DefaultChatBox />;
    }

    if (isLoading) {
        return <ChatBoxSkeleton />;
    }

    return (
        <div className='flex flex-col h-[629.5px]'>
            <div className="h-12 border-b border-black bg-gray-800 text-white dark:border-white flex items-center pl-6">
                <div className='flex-grow flex space-x-4 items-center'>
                    <Image src={avatar} alt='avatar' className='h-8 w-8 border border-black rounded-full' />
                    <h1 className=''>{selectedUser?.username}</h1>
                </div>
                <div className='space-x-2 pr-8 flex items-center'>
                    <FontAwesomeIcon icon={faPhone} className='border border-white p-2 hover:bg-white hover:text-black hover:cursor-pointer' />
                    <FontAwesomeIcon icon={faVideo} className='border border-white p-2 hover:bg-white hover:text-black hover:cursor-pointer' />
                </div>
            </div>
            <div className='flex-grow flex flex-col p-4 space-y-4 bg-gray-300 dark:bg-black overflow-auto h-0 no-scrollbar'> 
                {renderedMessages}
                <div ref={messagesEndRef} />
            </div>
            <div className='h-16 border-t bg-gray-800 text-white border-black dark:border-white flex items-center space-x-4 px-4'>
                <FontAwesomeIcon icon={faPlus} fontSize={20} className='border border-white p-2 hover:bg-white hover:text-black hover:cursor-pointer rounded-full' />
                <input
                    type='text'
                    placeholder='Message'
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className='bg-gray-300 text-black flex-grow h-8 rounded-lg p-2 border border-black'
                />
                <FontAwesomeIcon icon={faPaperPlane} onClick={handleSendMessage} fontSize={20} className='border border-white p-2 hover:bg-white hover:text-black hover:cursor-pointer rounded-full' />
            </div>
        </div>
    )
}
const ChatBoxSkeleton = () => {
    return (
        <div className='flex flex-col h-[629.5px] animate-pulse'>
            <div className="h-12 border-b border-black bg-gray-800 text-white dark:border-white flex items-center pl-6">
                <div className='flex-grow flex space-x-4 items-center'>
                    <div className='h-8 w-8 bg-gray-400 rounded-full'></div>
                    <div className='h-4 w-24 bg-gray-400 rounded'></div>
                </div>
                <div className='space-x-2 pr-8 flex items-center'>
                    <div className='h-8 w-8 bg-gray-400'></div>
                    <div className='h-8 w-8 bg-gray-400'></div>
                </div>
            </div>
            <div className='flex-grow flex flex-col p-4 space-y-4 bg-gray-300 dark:bg-black overflow-auto h-0 no-scrollbar'> 
                {[...Array(8)].map((_, index) => (
                    <div key={index} className={`flex ${index % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                        <div className={`h-10 w-64 ${index % 2 === 0 ? 'bg-blue-300' : 'bg-gray-400'} rounded-lg`}></div>
                    </div>
                ))}
            </div>
            <div className='h-16 border-t bg-gray-800 text-white border-black dark:border-white flex items-center space-x-4 px-4'>
                <div className='h-8 w-8 bg-gray-400 rounded-full'></div>
                <div className='bg-gray-300 flex-grow h-8 rounded-lg'></div>
                <div className='h-8 w-8 bg-gray-400 rounded-full'></div>
            </div>
        </div>
    )
}

export { ChatBoxSkeleton };
export default React.memo(ChatBox);

