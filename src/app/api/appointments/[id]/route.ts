import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import dbConnect from "@/src/lib/dbConnect"
import Patient from "@/src/models/patientModel"
import Doctor from "@/src/models/doctorModel"
import Appointment from "@/src/models/appointmentModel"
import mongoose from "mongoose"

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

// PATCH - Cancel an appointment (update status to cancelled)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect()
    const { id } = await params

    const authHeader = req.headers.get("authorization")
    const decoded = verifyAuth(authHeader)

    // Validate appointment ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid appointment ID" }, { status: 400 })
    }

    const appointment = await Appointment.findById(id)
    if (!appointment) {
      return NextResponse.json({ success: false, message: "Appointment not found" }, { status: 404 })
    }

    // Authorization check
    if (decoded.role === "patient") {
      const patient = await Patient.findOne({ userId: decoded.sub })
      if (!patient || appointment.patientId.toString() !== patient._id.toString()) {
        return NextResponse.json({ success: false, message: "Unauthorized to cancel this appointment" }, { status: 403 })
      }
    } else if (decoded.role === "doctor") {
      const doctor = await Doctor.findOne({ userId: decoded.sub })
      if (!doctor || appointment.doctorId.toString() !== doctor._id.toString()) {
        return NextResponse.json({ success: false, message: "Unauthorized to cancel this appointment" }, { status: 403 })
      }
    } else if (decoded.role !== "admin" && decoded.role !== "super_admin") {
      return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 403 })
    }

    // Check if appointment is already completed or cancelled
    if (appointment.status === "completed") {
      return NextResponse.json({ success: false, message: "Cannot cancel a completed appointment" }, { status: 400 })
    }

    if (appointment.status === "cancelled") {
      return NextResponse.json({ success: false, message: "Appointment is already cancelled" }, { status: 400 })
    }

    // Get cancellation reason and status from request body
    const body = await req.json()
    const { reason, status: newStatus, doctorNote, patientNote } = body

    // Build update object based on provided fields
    const updateData: any = {}
    
    if (newStatus) {
      // Validate status transition
      if (newStatus === "completed" && !["scheduled", "confirmed"].includes(appointment.status)) {
        return NextResponse.json(
          { success: false, message: "Cannot mark this appointment as completed" },
          { status: 400 }
        )
      }
      updateData.status = newStatus
    }
    
    if (reason !== undefined) {
      updateData.cancellationReason = reason
      updateData.cancelledAt = new Date()
    }
    
    if (doctorNote !== undefined) {
      updateData.doctorNote = doctorNote
    }
    
    if (patientNote !== undefined) {
      updateData.patientNote = patientNote
    }

    // Update appointment
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    )

    return NextResponse.json(
      {
        success: true,
        message: "Appointment updated successfully",
        appointment: updatedAppointment,
      },
      { status: 200 }
    )
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

// DELETE - Delete an appointment (remove from database)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect()
    const { id } = await params

    const authHeader = req.headers.get("authorization")
    const decoded = verifyAuth(authHeader)

    // Validate appointment ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid appointment ID" }, { status: 400 })
    }

    const appointment = await Appointment.findById(id)
    if (!appointment) {
      return NextResponse.json({ success: false, message: "Appointment not found" }, { status: 404 })
    }

    // Authorization check - only admins can delete, or patients/doctors can delete their own pending/scheduled appointments
    if (decoded.role === "patient") {
      const patient = await Patient.findOne({ userId: decoded.sub })
      if (!patient || appointment.patientId.toString() !== patient._id.toString()) {
        return NextResponse.json({ success: false, message: "Unauthorized to delete this appointment" }, { status: 403 })
      }
      // Patients can only delete scheduled/pending appointments
      if (!["scheduled", "pending"].includes(appointment.status)) {
        return NextResponse.json(
          { success: false, message: "Can only delete scheduled or pending appointments" },
          { status: 400 }
        )
      }
    } else if (decoded.role === "doctor") {
      const doctor = await Doctor.findOne({ userId: decoded.sub })
      if (!doctor || appointment.doctorId.toString() !== doctor._id.toString()) {
        return NextResponse.json({ success: false, message: "Unauthorized to delete this appointment" }, { status: 403 })
      }
      // Doctors can only delete scheduled/pending appointments
      if (!["scheduled", "pending"].includes(appointment.status)) {
        return NextResponse.json(
          { success: false, message: "Can only delete scheduled or pending appointments" },
          { status: 400 }
        )
      }
    } else if (decoded.role !== "admin" && decoded.role !== "super_admin") {
      return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 403 })
    }

    // Delete the appointment
    await Appointment.findByIdAndDelete(id)

    return NextResponse.json(
      {
        success: true,
        message: "Appointment deleted successfully",
      },
      { status: 200 }
    )
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
