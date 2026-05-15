import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/src/lib/dbConnect";
import User from "@/src/models/userModel";
import {signToken}  from "@/src/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { 
          error: "Email and OTP are required" },
        { status: 400 },
      );
    }

    // ✅ REMOVE role restriction
    const user = await User.findOne({ email });


    if (!user || !user.emailOtp?.codeHash) {
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400 }
      );
    }

    // ⏰ Check expiry
    if (
      user.emailOtp.expiresAt &&
      user.emailOtp.expiresAt < new Date()
    ) {
      return NextResponse.json(
        { error: "OTP expired" },
        { status: 400 }
      );
    }

    // 🔐 Verify OTP
    const otpValid = await bcrypt.compare(
      otp,
      user.emailOtp.codeHash
    );

    if (!otpValid) {
      return NextResponse.json(
        { error: "Invalid OTP" },
        { status: 400 }
      );
    }

    // ✅ Mark verified
    user.isVerified = true;
    user.emailOtp = undefined;

    await user.save();

    // // 🧠 Token logic (role-based)
    // let token;

    // if (user.role === "patient") {
    //   // Patient → auto login after verify
    //   token = signToken({
    //     sub: user._id.toString(),
    //     role: user.role,
    //   });
    // } else {
    //   // Hospital / Doctor / Nurse → need approval
    //   if (user.approvalStatus === "approved") {
    //     token = signToken({
    //       sub: user._id.toString(),
    //       role: user.role,
    //       hospitalId: user.hospitalId?.toString(),
    //       isPrimaryAdmin: user.isPrimaryAdmin,
    //     });
    //   }
    // }

    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
      role: user.role,
      // approvalStatus: user.approvalStatus || "approved",
      // token,
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}


