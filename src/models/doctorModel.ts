import mongoose, { Schema, models } from "mongoose";

const doctorSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // Personal Information
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
        // required: true,
        },
       lng: {
            type: Number,
            // required: true,
        },
    },

    // Professional Information
    medicalRegNumber: {
      type: String,
      required: true,
      unique: true,
    },

    specialization: {
      type: String,
      required: true,
    },

    yearsOfExperience: {
      type: Number,
      required: true,
    },

    qualifications: {
      type: String,
      required: true,
    },

    // affiliatedHospital: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Hospital",
    //   required: true,
    // },
    affiliatedHospital: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    maxAppointmentsPerDay: {
      type: Number,
      default: 20,
    },

    appointments:{
      type: Number,
      default: 0,
    },

    consultationFee: {
      type: Number,
      default: 0,
    },


    isAppointmentOpen: {
      type: Boolean,
      default: true,
    },

    // Document URLs (stored from Cloudinary)
    governmentId: {
      type: String,
      default: null,
    },

    medicalLicense: {
      type: String,
      default: null,
    },

    degreeCertificates: {
      type: String,
      default: null,
    },

    recentPhotograph: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Doctor =
  models.Doctor || mongoose.model("Doctor", doctorSchema);

export default Doctor;