import db from "@repo/db/client";
import { ApiResponse } from "../../../types/ApiResponse";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await db.$queryRaw`SELECT 1`;

        const response: ApiResponse = {
            success: true,
            message: "Server is up and running..."
        }
        return NextResponse.json(response, {status: 200});
    } catch (error : any) {
        const response: ApiResponse = {
            success: false,
            message: "Server error",
            errors: [error.message]
        }
        return NextResponse.json(response, {status: 500})
    }
}