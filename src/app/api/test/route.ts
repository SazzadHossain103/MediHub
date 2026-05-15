import { NextResponse } from "next/server";
import connectDB from "@/src/lib/dbConnect";
import User from "@/src/models/userModel";

export async function GET() {
  try {
    await connectDB();

    await User.collection.dropIndex("email_1");

    return NextResponse.json({
      success: true,
      message: "Old email index removed",
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}