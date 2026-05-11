import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/src/lib/dbConnect";
import User from "@/src/models/userModel";
import { signToken } from "@/src/utils/jwt";


export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { email, otp } = await req.json();

    const user = await User.findOne({ email });

    if (!user || !user.loginOtp?.codeHash) {
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400 }
      );
    }

    // check expiry
    if (user.loginOtp.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "OTP expired" },
        { status: 400 }
      );
    }

    // compare OTP
    const isMatch = await bcrypt.compare(
      otp,
      user.loginOtp.codeHash
    );

    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid OTP" },
        { status: 400 }
      );
    }

    // clear OTP
    user.loginOtp = undefined;
    await user.save();

    console.log("Login OTP verified for user:", user);

    // generate JWT
    const token = signToken({
      sub: user._id,
      role: user.role,
      email: user.email,
    });

    const res = NextResponse.json({
      role: user.role,
      id: user._id,
      name: user.name,
      email: user.email,
      message: "Login successful",
      token,
    });

    console.log("verification successful, generated token:", token);

    // set cookie (if using cookies)
    res.cookies.set("patientToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/", // 🔥 MUST
      maxAge: 60 * 60 * 24 * 7,
    });

    if (user.role === "patient") {
      res.cookies.set("patientToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }
    else if (user.role === "doctor") {
      res.cookies.set("doctorToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }
    else if (user.role === "super_admin") {
      res.cookies.set("adminToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }
    else if (user.role === "admin") {
      res.cookies.set("adminToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }
    else if (user.role === "nurse") {
      res.cookies.set("nurseToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }
    else if (user.role === "hospital") {
      res.cookies.set("hospitalToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return res;

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}