"use client"
import { signIn, signOut, useSession } from "next-auth/react";
import { Appbar } from "@/components/appbar";
import { UserCard } from "@/components/userCard";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import ChatBox from "@/components/chatBox";
import { Skeleton } from "@/components/skeleton";

interface user {
  id: string;
  username: string;
  email: string;
  profile_picture: string;
  created_at: string;
  updated_at: string;
}

export default function Home() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<user[]>([]);
  const [chatroomId, setChatroomId] = useState('');
  const [selectedUser, setSelectedUser] = useState<user | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const currentUser = session?.user as any;

  const getAllUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get('/api/users');
      setUsers(data.data);
    } catch (error) {
      handleAxiosError(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const joinChatroom = useCallback(async (user: user) => {
    setSelectedUser(user);
    try {
      const { data } = await axios.post('/api/chatrooms/start',
        { otherUserIds: [user.id] },
        { headers: { 'current-user-id': currentUser?.id } }
      );
      setChatroomId(data.data.chatroomId);
    } catch (error) {
      handleAxiosError(error);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  return (
    <>
      <Appbar onSignin={signIn} onSignout={signOut} user={session?.user} />
      <div className="flex p-4 m-4 h-[calc(100vh-82px)] mx-32">
        <div className="space-y-1 border border-black dark:border-white p-4 bg-gray-800 text-white">
          <h1 className="pb-2 text-center text-xl">Users</h1>
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full mb-2" />
            ))
          ) : (
            users.filter(user => user.id !== currentUser?.id).map(user => (
              <UserCard
                key={user.id}
                user={user}
                joinChatroom={joinChatroom}
              />
            ))
          )}
        </div>
        <div className="border border-black dark:border-white flex-grow overflow-hidden">
          <ChatBox chatroomId={chatroomId} currentUser={currentUser} selectedUser={selectedUser} />
        </div>
      </div>
    </>
  );
}

function handleAxiosError(error: unknown) {
  if (axios.isAxiosError(error)) {
    error.response?.data.errors.forEach((err: string) => toast.error(err));
  } else {
    toast.error("An unexpected error occurred.");
  }
}
