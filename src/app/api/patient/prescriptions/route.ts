import mongoose from "mongoose"
import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import dbConnect from "@/src/lib/dbConnect"
import Patient from "@/src/models/patientModel"
import cloudinary from "@/src/lib/cloudinary"

interface TokenData {
  sub: string
  role: string
  email?: string
}

const verifyAuth = (authHeader: string | null) => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Authorization token missing")
  }

  const token = authHeader.split(" ")[1]
  return jwt.verify(token, process.env.JWT_SECRET!) as TokenData
}

const uploadPrescriptionImage = async (imageData: string) => {
  const match = imageData.match(/^data:(image\/[\w+\-.]+);base64,(.+)$/)
  if (!match) {
    throw new Error("Invalid prescription image data")
  }

  const buffer = Buffer.from(match[2], "base64")
  const result: any = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "medihub/patient/prescriptions",
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

export async function GET(req: NextRequest) {
  try {
    await dbConnect()

    const authHeader = req.headers.get("authorization")
    const decoded = verifyAuth(authHeader)

    if (decoded.role !== "patient" && decoded.role !== "admin" && decoded.role !== "super_admin") {
      return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 403 })
    }

    let patientId = decoded.sub
    if (decoded.role === "admin" || decoded.role === "super_admin") {
      const url = new URL(req.url)
      const userId = url.searchParams.get("userId")
      if (userId) patientId = userId
    }

    const patient = await Patient.findOne({ userId: patientId }).lean()
    if (!patient) {
      return NextResponse.json({ success: false, message: "Patient profile not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, prescriptions: patient.prescriptions || [] }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect()

    const authHeader = req.headers.get("authorization")
    const decoded = verifyAuth(authHeader)

    if (decoded.role !== "patient") {
      return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 403 })
    }

    const body = await req.json()
    const { issue, doctor, imageData, notes } = body

    if (!issue || !doctor || !imageData) {
      return NextResponse.json({ success: false, message: "Issue, doctor, and image are required" }, { status: 400 })
    }

    const patientExists = await Patient.exists({ userId: decoded.sub })
    if (!patientExists) {
      return NextResponse.json({ success: false, message: "Patient profile not found" }, { status: 404 })
    }

    const imageUrl = await uploadPrescriptionImage(imageData)

    const newPrescription = {
      _id: new mongoose.Types.ObjectId(),
      issue,
      doctor,
      imageUrl,
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      notes: notes || null,
    }

    await Patient.findOneAndUpdate(
      { userId: decoded.sub },
      { $push: { prescriptions: { $each: [newPrescription], $position: 0 } } },
      { new: true }
    )

    return NextResponse.json({ success: true, prescription: newPrescription }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect()

    const authHeader = req.headers.get("authorization")
    const decoded = verifyAuth(authHeader)

    if (decoded.role !== "patient") {
      return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 403 })
    }

    const url = new URL(req.url)
    const prescriptionId = url.searchParams.get("id")

    if (!prescriptionId) {
      return NextResponse.json({ success: false, message: "Prescription id is required" }, { status: 400 })
    }

    const updateResult = await Patient.updateOne(
      { userId: decoded.sub },
      { $pull: { prescriptions: { _id: prescriptionId } } }
    )

    if (updateResult.matchedCount === 0) {
      return NextResponse.json({ success: false, message: "Patient profile not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Prescription removed" }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
