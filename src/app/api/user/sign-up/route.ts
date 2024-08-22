import db from "@repo/db/client";
import { userSchema } from "@repo/common/userSchema";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { ApiResponse } from "../../../../types/ApiResponse";

// endpoint for user signup
export async function POST(request: Request) {
  try {
    const { firstName, lastName, username, email, password } =
      await request.json();

    // zod validation
    const result = userSchema.safeParse({
      firstName,
      lastName,
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
    const existingUser = await db.user.findFirst({
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
    const newUser = await db.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        name: `${firstName} ${lastName}`,
      },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        bio: true,
        location: true,
        role: true,
        user_type: true,
        profile_picture_url: true,
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
