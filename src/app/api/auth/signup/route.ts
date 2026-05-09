// import { NextRequest, NextResponse } from "next/server";
// import connectDB from "@/lib/dbConnect";
// import User from "@/models/userModel";
// import bcrypt from "bcryptjs";

// export async function POST(req: NextRequest) {
//   try {
//     await connectDB();

//     const { name, email, password } = await req.json();

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return NextResponse.json({ error: "User already exists" }, { status: 400 });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       role: "patient",
//     });

//     return NextResponse.json({
//       message: "User created successfully",
//       user,
//     });

//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
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

    const { name, email, password, role } = await req.json();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = generateOTP();
    const otpHash = await bcrypt.hash(otp, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      emailOtp: {
        codeHash: otpHash,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    // ✅ use your email function
    await sendOtpEmail({
      to: email,
      otp,
      name,
    });

    return NextResponse.json({
      message: "Signup successful. OTP sent to email",
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}