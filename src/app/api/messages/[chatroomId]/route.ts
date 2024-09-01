import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';
import { ApiResponse } from '@/types/ApiResponse';

export async function GET(request: Request, { params }: { params: { chatroomId: string } }) {
  const { chatroomId } = params;

  if (!chatroomId) {
    const response: ApiResponse = {
      success: false,
      message: "Invalid or missing chatroomId",
    };
    return NextResponse.json(response, { status: 400 });
  }

  try {
    const messages = await prisma.messages.findMany({
      where: { chatroom_id: chatroomId },
      orderBy: { created_at: 'asc' },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            profile_picture: true,
          }
        }
      }
    });

    const response: ApiResponse = {
      success: true,
      message: "Messages fetched successfully",
      data: messages,
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      message: "An error occurred while fetching messages",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
