import { NextResponse } from "next/server";
import { ApiResponse } from "../../../types/ApiResponse";
import { loginSchema } from "../../../../schema/login.schema";
import prisma from "../../../../lib/prisma";
import bcrypt from "bcrypt";

// end point for user log in
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // zod validation
    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      const response: ApiResponse = {
        success: false,
        message: "Validation failed",
        errors: result.error.errors.map((e) => `${e.path}: ${e.message}`),
      };
      return NextResponse.json(response, { status: 400 });
    }

    // fetching user from db
    const user = await prisma.users.findFirst({
      where: { email },
    });

    if (!user) {
      const response: ApiResponse = {
        success: false,
        message: "Invalid email or password",
      };
      return NextResponse.json(response, { status: 401 });
    }

    // password validation
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      const response: ApiResponse = {
        success: false,
        message: "Invalid email or password",
      };
      return NextResponse.json(response, { status: 401 });
    }

    // removing password from response
    const { password_hash: _, ...userResponse } = user;

    const response: ApiResponse = {
      success: true,
      message: "User logged in successfully",
      data: userResponse,
    };
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
