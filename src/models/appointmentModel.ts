import mongoose, { Schema, models } from "mongoose";

const appointmentSchema = new Schema(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    hospitalId: {
      type: Schema.Types.ObjectId,
      ref: "Hospital",
      required: false,
    },

    appointmentDate: {
      type: Date,
      required: true,
    },

    timeSlot: {
      type: String,
      required: true,
    },

    serialNumber: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["scheduled", "confirmed", "completed", "cancelled", "no_show"],
      default: "scheduled",
    },

    visitType: {
      type: String,
      enum: ["new", "follow_up", "emergency"],
      default: "new",
    },

    consultationMode: {
      type: String,
      enum: ["in_person", "telehealth"],
      default: "in_person",
    },

    reasonForVisit: {
      type: String,
      default: null,
    },

    patientNote: {
      type: String,
      default: null,
    },

    doctorNote: {
      type: String,
      default: null,
    },

    fee: {
      type: Number,
      default: 0,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    contactSnapshot: {
      name: { type: String, default: null },
      phone: { type: String, default: null },
      email: { type: String, default: null },
    },

    doctorSnapshot: {
      name: { type: String, default: null },
      specialty: { type: String, default: null },
      phone: { type: String, default: null },
      email: { type: String, default: null },
      avatar: { type: String, default: null },
    },

    hospitalSnapshot: {
      name: { type: String, default: null },
      address: { type: String, default: null },
      phone: { type: String, default: null },
    },

    cancelledAt: {
      type: Date,
      default: null,
    },

    cancellationReason: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Appointment = models.Appointment || mongoose.model("Appointment", appointmentSchema);

export default Appointment;
