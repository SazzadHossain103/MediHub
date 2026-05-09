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

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (!user.emailOtp?.codeHash) {
      return NextResponse.json(
        { error: "No OTP found" },
        { status: 400 }
      );
    }

    // check expiry
    if (user.emailOtp.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "OTP expired" },
        { status: 400 }
      );
    }

    // compare hashed OTP
    const isMatch = await bcrypt.compare(
      otp,
      user.emailOtp.codeHash
    );

    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid OTP" },
        { status: 400 }
      );
    }

    // mark verified
    user.isVerified = true;

    // clear OTP
    user.emailOtp = undefined;

    await user.save();

    // generate JWT
    const token = signToken({
      id: user._id,
      role: user.role,
      email: user.email,
    });

    return NextResponse.json({
      message: "Email verified successfully",
      token,
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}