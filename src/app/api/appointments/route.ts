import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import dbConnect from "@/src/lib/dbConnect"
import Patient from "@/src/models/patientModel"
import Doctor from "@/src/models/doctorModel"
import Appointment from "@/src/models/appointmentModel"

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

const startOfDay = (date: Date) => {
  const start = new Date(date)
  start.setHours(0, 0, 0, 0)
  return start
}

const endOfDay = (date: Date) => {
  const end = new Date(date)
  end.setHours(23, 59, 59, 999)
  return end
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect()

    const authHeader = req.headers.get("authorization")
    const decoded = verifyAuth(authHeader)

    const filter: any = {}
    if (decoded.role === "patient") {
      const patient = await Patient.findOne({ userId: decoded.sub })
      if (!patient) {
        return NextResponse.json({ success: false, message: "Patient profile not found" }, { status: 404 })
      }
      filter.patientId = patient._id
    } else if (decoded.role === "doctor") {
      const doctor = await Doctor.findOne({ userId: decoded.sub })
      if (!doctor) {
        return NextResponse.json({ success: false, message: "Doctor profile not found" }, { status: 404 })
      }
      filter.doctorId = doctor._id
    } else if (decoded.role === "admin" || decoded.role === "super_admin") {
      const url = new URL(req.url)
      const patientId = url.searchParams.get("patientId")
      const doctorId = url.searchParams.get("doctorId")
      if (patientId) filter.patientId = patientId
      if (doctorId) filter.doctorId = doctorId
    } else {
      return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 403 })
    }

    const appointments = await Appointment.find(filter)
      .sort({ appointmentDate: 1, serialNumber: 1 })
      .lean()

    return NextResponse.json({ success: true, appointments }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect()

    const authHeader = req.headers.get("authorization")
    const decoded = verifyAuth(authHeader)

    if (decoded.role !== "patient" && decoded.role !== "admin" && decoded.role !== "super_admin") {
      return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 403 })
    }

    const body = await req.json()
    const { doctorId, appointmentDate, timeSlot, visitType, consultationMode, reasonForVisit, fee, patientName, mobileNumber, patientNote } = body

    if (!doctorId || !appointmentDate || !timeSlot) {
      return NextResponse.json({ success: false, message: "doctorId, appointmentDate and timeSlot are required" }, { status: 400 })
    }

    const patient = await Patient.findOne({ userId: decoded.sub })
    if (!patient) {
      return NextResponse.json({ success: false, message: "Patient profile not found" }, { status: 404 })
    }

    const doctor = await Doctor.findById(doctorId)
    if (!doctor) {
      return NextResponse.json({ success: false, message: "Doctor not found" }, { status: 404 })
    }

    if (doctor.isAppointmentOpen === false) {
      return NextResponse.json({ success: false, message: "Doctor is not accepting new appointments" }, { status: 400 })
    }

    const appointmentDay = new Date(appointmentDate)
    if (Number.isNaN(appointmentDay.getTime())) {
      return NextResponse.json({ success: false, message: "Invalid appointmentDate format" }, { status: 400 })
    }

    const existingCount = await Appointment.countDocuments({
      doctorId: doctor._id,
      appointmentDate: { $gte: startOfDay(appointmentDay), $lte: endOfDay(appointmentDay) },
      status: { $nin: ["cancelled", "no_show"] },
    })

    const serialNumber = existingCount + 1
    if (doctor.maxAppointmentsPerDay && serialNumber > doctor.maxAppointmentsPerDay) {
      return NextResponse.json({ success: false, message: "Doctor has reached maximum appointments for this day" }, { status: 400 })
    }

    const appointment = await Appointment.create({
      patientId: patient._id,
      doctorId: doctor._id,
      hospitalId: null,
      appointmentDate: appointmentDay,
      timeSlot,
      serialNumber,
      status: "scheduled",
      visitType: visitType || "new",
      consultationMode: consultationMode || "in_person",
      reasonForVisit: reasonForVisit || null,
      fee: typeof fee === "number" ? fee : parseFloat(fee) || 0,
      paymentStatus: "pending",
      contactSnapshot: {
        name: patientName || patient.fullName,
        phone: mobileNumber || patient.contactNumber,
        email: patient.email,
      },
      doctorSnapshot: {
        name: doctor.fullName,
        specialty: doctor.specialization,
        phone: doctor.contactNumber,
        email: doctor.email,
        avatar: doctor.avatar,
      },
      hospitalSnapshot: {
        name: doctor.affiliatedHospital || null,
        address: doctor.address || null,
        phone: doctor.contactNumber || null,
      },
      patientNote: patientNote || null,
    })

    return NextResponse.json({ success: true, appointment }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
