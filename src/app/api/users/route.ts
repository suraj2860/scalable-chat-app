import { NextResponse } from "next/server";
import { ApiResponse } from "../../../types/ApiResponse";
import prisma from "../../../../lib/prisma";

// end point to get all users
export async function GET() {
  try {
    // Fetch all users from the database
    const users = await prisma.users.findMany({
        select: {
          id: true,
          username: true,
          email: true,
          profile_picture: true,
          created_at: true,
          updated_at: true,
        },
      });
  
      // Create a successful response
      const response: ApiResponse = {
        success: true,
        message: "Users retrieved successfully",
        data: users,
      };
  
      // Return the response with a 200 status code
      return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      message: "Server error",
      errors: [error.message],
    };
    return NextResponse.json(response, { status: 500 });
  }
}
