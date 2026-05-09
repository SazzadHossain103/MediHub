import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {

    // 🔥 Clear cookie
    const res = NextResponse.json({
      message: "Logged out successfully",
    });

    res.cookies.set("adminToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/", // 🔥 SAME AS LOGIN
      expires: new Date(0), // 🔥 stronger than maxAge
    });

    console.log("Admin logged out, token cookie cleared", res.cookies.get("adminToken"));

    return res;

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}