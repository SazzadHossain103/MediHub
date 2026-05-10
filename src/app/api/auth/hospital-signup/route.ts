import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import dbConnect from "@/src/lib/dbConnect"
import Hospital from "@/src/models/hospitalModel"
import { generateOTP } from "@/src/utils/generateOtp"
import { sendOtpEmail } from "@/src/lib/email"

export async function POST(req: NextRequest) {
  try {
    await dbConnect()

    const {
      hospitalName,
      email,
      password,
      licenseNumber,
      address,
      phone,
      location,
      licenseDocument,
    } = await req.json()

    // Validate required fields
    if (!hospitalName || !email || !password || !licenseNumber || !address || !phone) {
      return NextResponse.json(
        { error: "All required fields must be provided" },
        { status: 400 }
      )
    }

    // Check if hospital already exists with same email or license number
    const existingHospital = await Hospital.findOne({
      $or: [{ email }, { licenseNumber }],
    })

    if (existingHospital) {
      if (existingHospital.email === email) {
        return NextResponse.json(
          { error: "Hospital with this email already exists" },
          { status: 400 }
        )
      }
      if (existingHospital.licenseNumber === licenseNumber) {
        return NextResponse.json(
          { error: "Hospital with this license number already exists" },
          { status: 400 }
        )
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Generate OTP for email verification
    const otp = generateOTP()
    const otpHash = await bcrypt.hash(otp, 10)

    // Create hospital record
    const hospital = await Hospital.create({
      name: hospitalName,
      email,
      password: hashedPassword,
      licenseNumber,
      address,
      phone,
      location: location ? {
        lat: location.lat,
        lng: location.lng,
      } : undefined,
      licenseDocument,
      status: "pending",
      emailOtp: {
        codeHash: otpHash,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      },
    })

    // Send OTP email
    try {
      await sendOtpEmail({
        to: email,
        otp,
        name: hospitalName,
      })
    } catch (emailError) {
      console.error("Failed to send OTP email:", emailError)
      // Don't fail the registration if email fails, but log it
    }

    return NextResponse.json({
      message: "Hospital registration successful. Please verify your email with the OTP sent.",
      hospitalId: hospital._id,
    })

  } catch (error: any) {
    console.error("Hospital signup error:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}