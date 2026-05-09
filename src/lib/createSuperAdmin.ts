import bcrypt from "bcryptjs";
import User from "@/src/models/userModel";

export const createSuperAdmin = async () => {
  try {
    const email = process.env.SUPER_ADMIN_EMAIL;
    const password = process.env.SUPER_ADMIN_PASSWORD;
    const name = process.env.SUPER_ADMIN_NAME;

    if (!email || !password || !name) {
      console.log("Super admin env variables missing");
      return;
    }

    const existingAdmin = await User.findOne({
      email,
      role: "super_admin",
    });

    if (existingAdmin) {
      console.log("Super admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: "super_admin",
      isVerified: true,
    });

    console.log("✅ Super admin created successfully");
  } catch (error) {
    console.log("❌ Super admin creation failed:", error);
  }
};