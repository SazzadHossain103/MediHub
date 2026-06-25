import mongoose, { Schema, models } from "mongoose";

const patientSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    fullName: {
      type: String,
      required: true,
    },

    avatar: {
      type: String,
      default: null,
    },

    dateOfBirth: {
      type: Date,
      required: true,
    },

    age: {
      type: Number,
      default: null,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },

    contactNumber: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    location: {
      lat: {
        type: Number,
        default: null,
      },
      lng: {
        type: Number,
        default: null,
      },
    },

    bloodType: {
      type: String,
      default: null,
    },

    height: {
      type: String,
      default: null,
    },

    weight: {
      type: String,
      default: null,
    },

    bmi: {
      type: Number,
      default: null,
    },

    emergencyContact: {
      name: { type: String, default: null },
      relation: { type: String, default: null },
      phone: { type: String, default: null },
    },

    vitalSigns: {
      bloodPressure: { type: String, default: null },
      heartRate: { type: Number, default: null },
      temperature: { type: Number, default: null },
      oxygenSaturation: { type: Number, default: null },
    },

    allergies: [
      {
        name: { type: String, required: true },
        severity: { type: String, default: null },
        reaction: { type: String, default: null },
      },
    ],

    conditions: [
      {
        name: { type: String, required: true },
        diagnosedDate: { type: String, default: null },
        status: { type: String, default: null },
      },
    ],

    medications: [
      {
        name: { type: String, required: true },
        dosage: { type: String, default: null },
        prescribedBy: { type: String, default: null },
        startDate: { type: String, default: null },
        endDate: { type: String, default: null },
      },
    ],

    immunizations: [
      {
        name: { type: String, required: true },
        date: { type: String, default: null },
        nextDue: { type: String, default: null },
      },
    ],

    medicalHistory: [
      {
        date: { type: String, default: null },
        type: { type: String, default: null },
        provider: { type: String, default: null },
        hospital: { type: String, default: null },
        notes: { type: String, default: null },
      },
    ],

    registeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Patient = models.Patient || mongoose.model("Patient", patientSchema);

export default Patient;
