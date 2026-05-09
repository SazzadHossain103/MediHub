import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import jwt, { SignOptions } from "jsonwebtoken";
import User from "@/src/models/userModel";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const TOKEN_TTL = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

type AuthPayload = {
  sub: string;
  role: string;
  hospitalId?: string;
  isPrimaryAdmin?: boolean;
};

export function signToken(payload: AuthPayload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: TOKEN_TTL as SignOptions["expiresIn"],
  });
}

export async function requireAuth(
  req: NextRequest,
  roles?: string[]
): Promise<{ user: any } | { error: NextResponse }> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, JWT_SECRET) as AuthPayload;
    const user = await User.findById(payload.sub);

    if (!user) {
      return {
        error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      };
    }

    if (roles && !roles.includes(user.role)) {
      return {
        error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
      };
    }

    return { user };
  } catch (error) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
}