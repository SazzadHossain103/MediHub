// // app/api/auth/login/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
// import User from "@/models/userModel";
// import connectDB from "@/lib/dbConnect";
// import { signToken } from "@/utils/jwt";
// import { generateOTP } from "@/utils/generateOtp";
// import { sendOtpEmail } from "@/lib/email";

// export async function POST(req: NextRequest) {
//   try {
//     await connectDB();

//     const { email, password } = await req.json();

//     // Validate input
//     if (!email || !password) {
//       return NextResponse.json(
//         { message: "Email and password required" },
//         { status: 400 }
//       );
//     }

//     // Find user
//     const user = await User.findOne({ email });

//     if (!user) {
//       return NextResponse.json(
//         { message: "Invalid credentials" },
//         { status: 401 }
//       );
//     }

//     // Compare password
//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return NextResponse.json(
//         { message: "Invalid credentials" },
//         { status: 401 }
//       );
//     }

//     // Generate token
//     const token = signToken({
//       userId: user._id,
//       role: user.role,
//     });

//     const otp = generateOTP();
//     const otpHash = await bcrypt.hash(otp, 10);

//     // ✅ use your email function
//     await sendOtpEmail({
//       to: email,
//       otp,
//       name,
//     });

//     return NextResponse.json({
//       success: true,
//       message: "Login successful",
//       token,
//       user: {
//         id: user._id,
//         email: user.email,
//         role: user.role,
//       },
//     });

//   } catch (error) {
//     console.error("Login error:", error);

//     return NextResponse.json(
//       { message: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/src/lib/dbConnect";
import User from "@/src/models/userModel";
import { generateOTP } from "@/src/utils/generateOtp";
import { sendOtpEmail } from "@/src/lib/email";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { email, password } = await req.json();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 400 }
      );
    }

    // ❗ must verify email first
    if (!user.isVerified) {
      return NextResponse.json(
        { error: "Please verify your email first" },
        { status: 403 }
      );
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 400 }
      );
    }

    // generate OTP
    const otp = generateOTP();
    const otpHash = await bcrypt.hash(otp, 10);

    // save login OTP
    user.loginOtp = {
      codeHash: otpHash,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    };

    await user.save();

    console.log("user login" ,user);

    // send OTP
    await sendOtpEmail({
      to: user.email,
      otp,
      name: user.name,
    });

    return NextResponse.json({
      message: "Login OTP sent to email",
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}