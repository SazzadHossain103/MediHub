import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/src/lib/dbConnect";
import Doctor from "@/src/models/doctorModel";
import jwt from "jsonwebtoken";

interface TokenData {
  id: string;
  role: string;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    // Await params
    const { id } = await params;

    // Get Authorization header
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          message: "Authorization token missing",
        },
        { status: 401 }
      );
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as TokenData;

    // Role check
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