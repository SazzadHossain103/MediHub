import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import connectDB from "@/src/lib/dbConnect";

import User from "@/src/models/userModel";
import Doctor from "@/src/models/doctorModel";
import Hospital from "@/src/models/hospitalModel";

import { generateOTP } from "@/src/utils/generateOtp";
import { sendOtpEmail } from "@/src/lib/email";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();

        const {
            // Personal Information
            fullName,
            dateOfBirth,
            gender,
            contactNumber,
            email,
            address,

            // Professional Information
            medicalRegNumber,
            specialization,
            yearsOfExperience,
            qualifications,
            affiliatedHospital,

            // Account
            password,
        } = body;

        // Validation
        if (
            !fullName ||
            !dateOfBirth ||
            !gender ||
            !contactNumber ||
            !email ||
            !address ||
            !medicalRegNumber ||
            !specialization ||
            !yearsOfExperience ||
            !qualifications ||
            !affiliatedHospital ||
            !password
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "All fields are required",
                },
                { status: 400 }
            );
        }

        // Check existing email
        const existingUser = await User.findOne({
            email,
        });

        if (existingUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Email already exists",
                },
                { status: 409 }
            );
        }

        // Check medical registration
        const existingDoctor = await Doctor.findOne({
            medicalRegNumber,
        });

        if (existingDoctor) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Medical registration number already exists",
                },
                { status: 409 }
            );
        }

        // Check hospital exists
        // const hospital = await Hospital.findById(
        //     affiliatedHospital
        // );

        // if (!hospital) {
        //     return NextResponse.json(
        //         {
        //             success: false,
        //             message: "Hospital not found",
        //         },
        //         { status: 404 }
        //     );
        // }

        // Hash password
        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

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
            name: fullName,
        });

        // Create User
        const user = await User.create({
            name: fullName,
            email,
            password: hashedPassword,

            role: "doctor",

            emailOtp: {
                codeHash: otpHash,
                expiresAt: otpExpiry,
            },
        });

        // Create Doctor Profile
        const doctor = await Doctor.create({
            userId: user._id,

            // Personal Information
            fullName,
            dateOfBirth,
            gender,
            contactNumber,
            email,
            address,

            // Professional Information
            medicalRegNumber,
            specialization,
            yearsOfExperience,
            qualifications,
            affiliatedHospital,

            status: "pending",
        });

        return NextResponse.json(
            {
                success: true,
                message: "Doctor signup successful",

                user,
                doctor,

                otp, // remove in production
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.log(error);

        return NextResponse.json(
            {
                success: false,
                message:
                    error.message || "Internal Server Error",
            },
            { status: 500 }
        );
    }
}