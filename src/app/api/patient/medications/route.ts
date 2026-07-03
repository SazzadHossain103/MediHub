import mongoose from "mongoose"
import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import dbConnect from "@/src/lib/dbConnect"
import Patient from "@/src/models/patientModel"

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

    return NextResponse.json({ success: true, medications: patient.medications || [] }, { status: 200 })
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
    const { name, dosage, prescribedBy, startDate, stockStatus } = body

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ success: false, message: "Medication name is required" }, { status: 400 })
    }

    const patientExists = await Patient.exists({ userId: decoded.sub })
    if (!patientExists) {
      return NextResponse.json({ success: false, message: "Patient profile not found" }, { status: 404 })
    }

    const newMedication = {
      _id: new mongoose.Types.ObjectId(),
      name: name.trim(),
      dosage: typeof dosage === "string" ? dosage : null,
      prescribedBy: typeof prescribedBy === "string" ? prescribedBy : null,
      startDate: typeof startDate === "string" ? startDate : null,
      stockStatus: typeof stockStatus === "string" ? stockStatus : "In stock",
    }

    await Patient.findOneAndUpdate(
      { userId: decoded.sub },
      { $push: { medications: { $each: [newMedication], $position: 0 } } },
      { new: true }
    )

    return NextResponse.json({ success: true, medication: newMedication }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await dbConnect()

    const authHeader = req.headers.get("authorization")
    const decoded = verifyAuth(authHeader)

    if (decoded.role !== "patient") {
      return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 403 })
    }

    const url = new URL(req.url)
    const medicationId = url.searchParams.get("id")

    if (!medicationId) {
      return NextResponse.json({ success: false, message: "Medication id is required" }, { status: 400 })
    }

    const body = await req.json()
    const patient = await Patient.findOne({ userId: decoded.sub })

    if (!patient) {
      return NextResponse.json({ success: false, message: "Patient profile not found" }, { status: 404 })
    }

    const medication = patient.medications.find((item: any) => item._id?.toString() === medicationId)
    if (!medication) {
      return NextResponse.json({ success: false, message: "Medication not found" }, { status: 404 })
    }

    if (typeof body.name === "string") medication.name = body.name.trim()
    if (typeof body.dosage === "string") medication.dosage = body.dosage
    if (typeof body.prescribedBy === "string") medication.prescribedBy = body.prescribedBy
    if (typeof body.startDate === "string") medication.startDate = body.startDate
    if (typeof body.stockStatus === "string") medication.stockStatus = body.stockStatus

    await patient.save()

    return NextResponse.json({ success: true, medication: medication.toObject() }, { status: 200 })
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
    const medicationId = url.searchParams.get("id")

    if (!medicationId) {
      return NextResponse.json({ success: false, message: "Medication id is required" }, { status: 400 })
    }

    const updateResult = await Patient.updateOne(
      { userId: decoded.sub },
      { $pull: { medications: { _id: new mongoose.Types.ObjectId(medicationId) } } }
    )

    if (updateResult.matchedCount === 0) {
      return NextResponse.json({ success: false, message: "Patient profile not found" }, { status: 404 })
    }

    if (updateResult.modifiedCount === 0) {
      return NextResponse.json({ success: false, message: "Medication not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Medication removed" }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
