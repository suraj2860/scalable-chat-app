import prisma from "../../../../lib/prisma";
import { signUpSchema } from "../../../../schema/signup.schema";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { ApiResponse } from "../../../types/ApiResponse";

// endpoint for user signup
export async function POST(request: Request) {
  try {
    const { username, email, password } =
      await request.json();

    // zod validation
    const result = signUpSchema.safeParse({
      username,
      email,
      password,
    });

    if (!result.success) {
      const response: ApiResponse = {
        success: false,
        message: "Validation failed",
        errors: result.error.errors.map((e) => `${e.path}: ${e.message}`),
      };
      return NextResponse.json(response, { status: 400 });
    }

    // password hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    // check for existing user by username and email
    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existingUser) {
      let errors: string[] = [];

      if (existingUser.username === username) {
        errors.push("Username already exists");
      }

      if (existingUser.email === email) {
        errors.push("Email already exists");
      }

      const response: ApiResponse = {
        success: false,
        message: "Registration failed due to existing credentials",
        errors,
      };
      return NextResponse.json(response, { status: 400 });
    }

    // creating record for new user in db
    const newUser = await prisma.users.create({
      data: {
        username,
        email,
        password_hash: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        email: true,
        profile_picture: true,
        created_at: true,
        updated_at: true,
        // Note: password is not included here
      },
    });

    const response: ApiResponse = {
      success: true,
      message: "User registered successfully",
      data: newUser,
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
