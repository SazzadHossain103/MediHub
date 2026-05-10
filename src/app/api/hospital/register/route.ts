import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import connectDB from "@/src/lib/dbConnect";

import User from "@/src/models/userModel";
import Hospital from "@/src/models/hospitalModel";

import { generateOTP } from "@/src/utils/generateOtp";
import { sendOtpEmail } from "@/src/lib/email";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    const {
      name,
      email,
      password,
      licenseNumber,
      address,
      phone,
      location,
      licenseDocument,
    } = body;

    console.log("Received hospital registration data:", body);

    if (
      !name ||
      !email ||
      !password ||
      !licenseNumber ||
      !address ||
      !phone
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "All required fields are required",
        },
        { status: 400 }
      );
    }

    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Email already exists",
        },
        { status: 409 }
      );
    }

    // Check existing license
    const existingLicense = await Hospital.findOne({
      licenseNumber,
    });

    if (existingLicense) {
      return NextResponse.json(
        {
          success: false,
          message: "License already exists",
        },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = generateOTP();
    const otpHash = await bcrypt.hash(otp, 10);

    const otpExpiry = new Date(
      Date.now() + 10 * 60 * 1000
    );

    // ✅ use your email function
    await sendOtpEmail({
      to: email,
      otp,
      name,
    });

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "hospital",

      emailOtp: {
        codeHash: otpHash,
        expiresAt: otpExpiry,
      },
    });

    // Create hospital profile
    const hospital = await Hospital.create({
      userId: user._id,

      name,
      licenseNumber,
      address,
      phone,
      location,
      licenseDocument,

      status: "pending",
      registeredAt: new Date(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Hospital signup successful",
        user,
        hospital,
        otp, // remove in production
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}