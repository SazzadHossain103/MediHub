import mongoose, { Schema, models } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["hospital", "doctor", "nurse", "patient", "admin", "super_admin"],
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  emailOtp: {
    codeHash: String,
    expiresAt: Date,
  },
  loginOtp: {
    codeHash: String,
    expiresAt: Date,
  },
}, { timestamps: true });

const User = models.User || mongoose.model("User", userSchema);

export default User;