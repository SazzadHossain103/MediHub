import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/src/lib/dbConnect";
import Patient from "@/src/models/patientModel";
import User from "@/src/models/userModel";
import cloudinary from "@/src/lib/cloudinary";

interface TokenData {
  sub: string;
  role: string;
  email?: string;
}

const verifyAuth = (authHeader: string | null) => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Authorization token missing");
  }

  const token = authHeader.split(" ")[1];
  return jwt.verify(token, process.env.JWT_SECRET!) as TokenData;
};

const uploadAvatarImage = async (avatarData: string) => {
  const match = avatarData.match(/^data:(image\/[\w+\-\.]+);base64,(.+)$/);
  if (!match) {
    throw new Error("Invalid avatar image data");
  }

  const buffer = Buffer.from(match[2], "base64");
  const result: any = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "medihub/patient/avatar",
          resource_type: "auto",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      )
      .end(buffer);
  });

  return result.secure_url;
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await params;
    const authHeader = req.headers.get("authorization");
    const decoded = verifyAuth(authHeader);

    if (decoded.role !== "patient" && decoded.role !== "admin" && decoded.role !== "super_admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized access",
        },
        { status: 403 }
      );
    }

    if (decoded.role === "patient" && decoded.sub !== id) {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden action",
        },
        { status: 403 }
      );
    }

    const patient = await Patient.findOne({ userId: id });

    if (!patient) {
      return NextResponse.json(
        {
          success: false,
          message: "Patient not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Patient fetched successfully",
        patient,
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
    await dbConnect();

    const { id } = await params;
    const authHeader = req.headers.get("authorization");
    const decoded = verifyAuth(authHeader);

    if (decoded.role !== "patient" && decoded.role !== "admin" && decoded.role !== "super_admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized access",
        },
        { status: 403 }
      );
    }

    if (decoded.role === "patient" && decoded.sub !== id) {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden action",
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const updateData: Record<string, any> = {};

    if (typeof body.fullName === "string") updateData.fullName = body.fullName;
    if (typeof body.name === "string") updateData.fullName = body.name;
    if (typeof body.dateOfBirth === "string") updateData.dateOfBirth = new Date(body.dateOfBirth);
    if (typeof body.gender === "string") updateData.gender = body.gender;
    if (typeof body.contactNumber === "string") updateData.contactNumber = body.contactNumber;
    if (typeof body.email === "string") updateData.email = body.email;
    if (typeof body.address === "string") updateData.address = body.address;
    if (typeof body.avatar === "string") {
      if (body.avatar.startsWith("data:image/")) {
        updateData.avatar = await uploadAvatarImage(body.avatar);
      } else {
        updateData.avatar = body.avatar;
      }
    }
    if (typeof body.bloodType === "string") updateData.bloodType = body.bloodType;
    if (typeof body.height === "string") updateData.height = body.height;
    if (typeof body.weight === "string") updateData.weight = body.weight;
    if (typeof body.bmi === "number") updateData.bmi = body.bmi;
    if (typeof body.bmi === "string") {
      const bmiValue = parseFloat(body.bmi);
      if (!isNaN(bmiValue)) updateData.bmi = bmiValue;
    }

    if (body.location && typeof body.location === "object") {
      const lat = typeof body.location.lat === "number" ? body.location.lat : null;
      const lng = typeof body.location.lng === "number" ? body.location.lng : null;
      updateData.location = { lat, lng };
    }

    if (body.emergencyContact && typeof body.emergencyContact === "object") {
      updateData.emergencyContact = {
        name: typeof body.emergencyContact.name === "string" ? body.emergencyContact.name : null,
        relation: typeof body.emergencyContact.relation === "string" ? body.emergencyContact.relation : null,
        phone: typeof body.emergencyContact.phone === "string" ? body.emergencyContact.phone : null,
      };
    }

    if (body.vitalSigns && typeof body.vitalSigns === "object") {
      updateData.vitalSigns = {
        bloodPressure: typeof body.vitalSigns.bloodPressure === "string" ? body.vitalSigns.bloodPressure : null,
        heartRate: typeof body.vitalSigns.heartRate === "number" ? body.vitalSigns.heartRate : null,
        temperature: typeof body.vitalSigns.temperature === "number" ? body.vitalSigns.temperature : null,
        oxygenSaturation: typeof body.vitalSigns.oxygenSaturation === "number" ? body.vitalSigns.oxygenSaturation : null,
      };
    }

    if (Array.isArray(body.allergies)) updateData.allergies = body.allergies;
    if (Array.isArray(body.conditions)) updateData.conditions = body.conditions;
    if (Array.isArray(body.medications)) updateData.medications = body.medications;
    if (Array.isArray(body.immunizations)) updateData.immunizations = body.immunizations;
    if (Array.isArray(body.medicalHistory)) updateData.medicalHistory = body.medicalHistory;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No valid fields provided for update",
        },
        { status: 400 }
      );
    }

    const patient = await Patient.findOneAndUpdate(
      { userId: id },
      { $set: updateData },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    if (!patient) {
      return NextResponse.json(
        {
          success: false,
          message: "Patient not found",
        },
        { status: 404 }
      );
    }

    if (typeof body.name === "string" || typeof body.email === "string") {
      const userUpdate: Record<string, any> = {};
      if (typeof body.name === "string") userUpdate.name = body.name;
      if (typeof body.email === "string") userUpdate.email = body.email;
      if (Object.keys(userUpdate).length > 0) {
        await User.findByIdAndUpdate(id, { $set: userUpdate });
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Patient updated successfully",
        patient,
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
