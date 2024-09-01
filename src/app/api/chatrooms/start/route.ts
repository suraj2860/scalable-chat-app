import { ApiResponse } from "@/types/ApiResponse";
import prisma from "../../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { otherUserIds, name } = await request.json();
  const userId = request.headers.get("current-user-id");

  // Validate current user ID
  if (!userId) {
    const response: ApiResponse = {
      success: false,
      message: "Unauthorized",
    };
    return NextResponse.json(response, { status: 401 });
  }

  // Validate otherUserIds
  if (!Array.isArray(otherUserIds) || otherUserIds.length === 0) {
    const response: ApiResponse = {
      success: false,
      message:
        "Invalid request body: otherUserIds must be an array with at least one user ID.",
    };
    return NextResponse.json(response, { status: 400 });
  }

  // Validate that otherUserIds do not include the current user ID
  if (otherUserIds.includes(userId)) {
    const response: ApiResponse = {
      success: false,
      message: "You cannot chat with yourself.",
    };
    return NextResponse.json(response, { status: 400 });
  }

  // Check if all other user IDs are valid
  const validUsers = await prisma.users.findMany({
    where: {
      id: { in: otherUserIds },
    },
    select: { id: true },
  });

  const validUserIds = validUsers.map((user) => user.id);

  if (validUserIds.length !== otherUserIds.length) {
    const response: ApiResponse = {
      success: false,
      message: "One or more user IDs are invalid.",
    };
    return NextResponse.json(response, { status: 400 });
  }

  // Determine if this is a one-to-one or group chat
  const isGroupChat = otherUserIds.length > 1 || (name && name.trim() !== "");

  if (isGroupChat) {
    // Handling group chat creation
    const existingGroupChat = await prisma.chatRooms.findFirst({
      where: {
        type: "group",
        name: name,
      },
      select: { id: true },
    });

    if (existingGroupChat) {
      const response: ApiResponse = {
        success: true,
        message: "ChatroomId fetched successfully",
        data: { chatroomId: existingGroupChat.id },
      };
      return NextResponse.json(response, { status: 200 });
    }

    const newGroupChat = await prisma.chatRooms.create({
      data: {
        type: "group",
        name: name,
        created_by: userId,
        members: {
          createMany: {
            data: [
              { user_id: userId, role: "admin" },
              ...otherUserIds.map((id: string) => ({
                user_id: id,
                role: "member" as const,
              })),
            ],
          },
        },
      },
      select: { id: true },
    });

    const response: ApiResponse = {
      success: true,
      message: "Chatroom created and id fetched successfully",
      data: { chatroomId: newGroupChat.id },
    };
    return NextResponse.json(response, { status: 200 });
  } else {
    // Handling one-to-one chat creation
    const otherUserId = otherUserIds[0];

    const existingChatRoom = await prisma.chatRooms.findFirst({
      where: {
        type: "private",
        AND: [
          { members: { some: { user_id: userId } } },
          { members: { some: { user_id: otherUserId } } },
        ],
      },
      select: { id: true },
    });

    if (existingChatRoom) {
      const response: ApiResponse = {
        success: true,
        message: "ChatroomId fetched successfully",
        data: { chatroomId: existingChatRoom.id },
      };
      return NextResponse.json(response, { status: 200 });
    }

    const newChatRoom = await prisma.chatRooms.create({
      data: {
        type: "private",
        created_by: userId,
        members: {
          createMany: {
            data: [
              { user_id: userId, role: "member" },
              { user_id: otherUserId, role: "member" },
            ],
          },
        },
      },
      select: { id: true },
    });

    const response: ApiResponse = {
      success: true,
      message: "Chatroom created and id fetched successfully",
      data: { chatroomId: newChatRoom.id },
    };
    return NextResponse.json(response, { status: 200 });
  }
}
