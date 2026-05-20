import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/src/lib/dbConnect";
import Doctor from "@/src/models/doctorModel";
import cloudinary from "@/src/lib/cloudinary";
import jwt from "jsonwebtoken";

interface TokenData {
  sub: string;
  role: string;
  email?: string;
}

const uploadAvatarImage = async (avatarData: string) => {
  const match = avatarData.match(/^data:(image\/[^;]+);base64,(.+)$/)
  if (!match) {
    throw new Error("Invalid avatar image data")
  }

  const buffer = Buffer.from(match[2], "base64")
  const result: any = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "medihub/doctor/avatar",
          resource_type: "auto",
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      )
      .end(buffer)
  })

  return result.secure_url
}

const verifyAuth = (authHeader: string | null) => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Authorization token missing")
  }

  const token = authHeader.split(" ")[1]
  return jwt.verify(token, process.env.JWT_SECRET!) as TokenData
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    // Await params
    const { id } = await params;

    const authHeader = req.headers.get("authorization");
    const decoded = verifyAuth(authHeader);

    if (
      decoded.role !== "doctor" &&
      decoded.role !== "admin" &&
      decoded.role !== "hospital"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized access",
        },
        { status: 403 }
      );
    }

    if (decoded.role === "doctor" && decoded.sub !== id) {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden action",
        },
        { status: 403 }
      );
    }

    // Find doctor by userId
    const doctor = await Doctor.findOne({
      userId: id,
    }).select("-password");

    if (!doctor) {
      return NextResponse.json(
        {
          success: false,
          message: "Doctor not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Doctor fetched successfully",
        doctor,
      },
      { status: 200 }
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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const authHeader = req.headers.get("authorization");
    const decoded = verifyAuth(authHeader);

    if (
      decoded.role !== "doctor" &&
      decoded.role !== "admin" &&
      decoded.role !== "hospital"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized access",
        },
        { status: 403 }
      );
    }

    if (decoded.role === "doctor" && decoded.sub !== id) {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden action",
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    console.log("Update doctor request body:", body)
    
    // Fetch current doctor to preserve existing values
    const currentDoctor = await Doctor.findOne({ userId: id })
    
    const updateData: Record<string, any> = {}

    if (typeof body.fullName === "string") updateData.fullName = body.fullName
    if (typeof body.email === "string") updateData.email = body.email
    if (typeof body.contactNumber === "string") updateData.contactNumber = body.contactNumber
    if (typeof body.address === "string") updateData.address = body.address
    if (typeof body.specialization === "string") updateData.specialization = body.specialization
    if (typeof body.yearsOfExperience === "number") updateData.yearsOfExperience = body.yearsOfExperience
    if (typeof body.qualifications === "string") updateData.qualifications = body.qualifications
    if (typeof body.affiliatedHospital === "string") updateData.affiliatedHospital = body.affiliatedHospital
    if (typeof body.maxAppointmentsPerDay === "number") updateData.maxAppointmentsPerDay = body.maxAppointmentsPerDay
    if (typeof body.consultationFee === "number") updateData.consultationFee = body.consultationFee
    else if (typeof body.consultationFee === "string" && body.consultationFee.trim() !== "") {
      const fee = parseFloat(body.consultationFee)
      if (!isNaN(fee) && fee >= 0) updateData.consultationFee = fee
    }
    
    // Handle chamberTime - always include it (new or existing)
    if (typeof body.chamberTime === "string" && body.chamberTime.trim() !== "") {
      updateData.chamberTime = body.chamberTime
      console.log("Updating chamberTime to:", body.chamberTime)
    } else if (currentDoctor?.chamberTime) {
      // Preserve existing chamberTime
      updateData.chamberTime = currentDoctor.chamberTime
    } else {
      // Set default if neither request nor DB has it
      updateData.chamberTime = "9:00 AM - 5:00 PM"
    }
    
    if (
      body.location &&
      typeof body.location.lat === "number" &&
      typeof body.location.lng === "number"
    ) {
      updateData.location = {
        lat: body.location.lat,
        lng: body.location.lng,
      }
    }
    if (typeof body.isAppointmentOpen === "boolean") updateData.isAppointmentOpen = body.isAppointmentOpen
    if (typeof body.avatarData === "string") {
      updateData.avatar = await uploadAvatarImage(body.avatarData)
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No valid fields provided for update",
        },
        { status: 400 }
      );
    }

    console.log("Updating doctor with data:", updateData)

    const doctor = await Doctor.findOneAndUpdate(
      { userId: id },
      { $set: updateData },
      { new: true , upsert: true, setDefaultsOnInsert: true }
    ).select("-password");

    if (!doctor) {
      return NextResponse.json(
        {
          success: false,
          message: "Doctor not found",
        },
        { status: 404 }
      );
    }
    console.log("Updated doctor:", doctor)

    return NextResponse.json(
      {
        success: true,
        message: "Doctor updated successfully",
        doctor,
      },
      { status: 200 }
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