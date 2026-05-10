import mongoose, { Schema, models } from "mongoose";

const hospitalSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
    },

    licenseNumber: {
      type: String,
      required: true,
      unique: true,
    },

    address: {
      type: String,
    //   required: true,
    },

    phone: {
      type: String,
    //   required: true,
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

    licenseDocument: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["pending", "approved"],
      default: "pending",
    },

    registeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Hospital =
  models.Hospital || mongoose.model("Hospital", hospitalSchema);

export default Hospital;