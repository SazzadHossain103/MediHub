import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  
  try {
    req.headers.get("authorization")?.startsWith("Bearer ") || (() => { throw new Error("Missing or invalid Authorization header") })();
    const token = req.headers.get("authorization")!.split(" ")[1];
    if (!token) throw new Error("Token not found in Authorization header");
    
    // 🔥 Clear cookie
    const res = NextResponse.json({
      message: "Logged out successfully",
    });

    res.cookies.set("doctorToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/", // 🔥 SAME AS LOGIN
      expires: new Date(0), // 🔥 stronger than maxAge
    });

    console.log("Doctor logged out, token cookie cleared", res.cookies.get("doctorToken"));

    return res;

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}