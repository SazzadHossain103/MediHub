
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import connectDB from "@/src/lib/dbConnect";

import User from "@/src/models/userModel";
import Doctor from "@/src/models/doctorModel";


import { generateOTP } from "@/src/utils/generateOtp";
import { sendOtpEmail } from "@/src/lib/email";
import cloudinary from "@/src/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();

    // =========================
    // TEXT DATA
    // =========================

    const fullName = formData.get("fullName") as string;

    const dateOfBirth = formData.get(
      "dateOfBirth"
    ) as string;

    const gender = formData.get("gender") as string;

    const contactNumber = formData.get(
      "contactNumber"
    ) as string;

    const email = formData.get("email") as string;

    const address = formData.get("address") as string;

    const medicalRegNumber = formData.get(
      "medicalRegNumber"
    ) as string;

    const specialization = formData.get(
      "specialization"
    ) as string;

    const yearsOfExperience = formData.get(
      "yearsOfExperience"
    ) as string;

    const qualifications = formData.get(
      "qualifications"
    ) as string;

    const affiliatedHospital = formData.get(
      "affiliatedHospital"
    ) as string;

    const password = formData.get("password") as string;

    // =========================
    // FILES
    // =========================

    const governmentId = formData.get(
      "governmentId"
    ) as File;

    const medicalLicense = formData.get(
      "medicalLicense"
    ) as File;

    const degreeCertificates = formData.get(
      "degreeCertificates"
    ) as File;

    const recentPhotograph = formData.get(
      "recentPhotograph"
    ) as File;

    // =========================
    // VALIDATION
    // =========================

    if (
      !fullName ||
      !email ||
      !password ||
      !governmentId ||
      !medicalLicense ||
      !degreeCertificates ||
      !recentPhotograph
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required",
        },
        { status: 400 }
      );
    }

    // =========================
    // EXISTING USER CHECK
    // =========================

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

    // =========================
    // CLOUDINARY UPLOAD FUNCTION
    // =========================

    const uploadFile = async (
      file: File,
      folder: string
    ) => {
      const bytes = await file.arrayBuffer();

      const buffer = Buffer.from(bytes);

      const result: any = await new Promise(
        (resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                folder,
                resource_type: "auto",
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            )
            .end(buffer);
        }
      );

      return result.secure_url;
    };

    // =========================
    // UPLOAD FILES
    // =========================

    const governmentIdUrl = await uploadFile(
      governmentId,
      "medihub/doctor/government-id"
    );

    const medicalLicenseUrl = await uploadFile(
      medicalLicense,
      "medihub/doctor/medical-license"
    );

    const degreeCertificatesUrl =
      await uploadFile(
        degreeCertificates,
        "medihub/doctor/degree-certificates"
      );

    const recentPhotographUrl =
      await uploadFile(
        recentPhotograph,
        "medihub/doctor/profile-photo"
      );

    // =========================
    // HASH PASSWORD
    // =========================

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // =========================
    // OTP
    // =========================

    const otp = generateOTP();

    const otpHash = await bcrypt.hash(
      otp,
      10
    );

    const otpExpiry = new Date(
      Date.now() + 10 * 60 * 1000
    );

    await sendOtpEmail({
      to: email,
      otp,
      name: fullName,
    });

    // =========================
    // CREATE USER
    // =========================

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

    // =========================
    // CREATE DOCTOR
    // =========================

    const doctor = await Doctor.create({
      userId: user._id,

      fullName,
      dateOfBirth,
      gender,
      contactNumber,
      email,
      address,

      medicalRegNumber,
      specialization,
      yearsOfExperience,
      qualifications,
      affiliatedHospital,

      // FILE URLS
      governmentId: governmentIdUrl,

      medicalLicense: medicalLicenseUrl,

      degreeCertificates:
        degreeCertificatesUrl,

      recentPhotograph:
        recentPhotographUrl,

      status: "pending",
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Doctor registration successful",

        user,
        doctor,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ||
          "Internal Server Error",
      },
      { status: 500 }
    );
  }
}