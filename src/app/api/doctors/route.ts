import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/src/lib/dbConnect";
import Doctor from "@/src/models/doctorModel";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // Optional query params (e.g., specialization)
    const { searchParams } = new URL(req.url);
    const specialization = searchParams.get("specialization") || null;

    const allParam = searchParams.get("all") === "1";
    const filter: any = {};
    if (!allParam) {
      filter.status = "approved";
    }
    if (specialization && specialization !== "all") {
      filter.specialization = specialization;
    }

    const doctors = await Doctor.find(filter).select("-__v").lean();

    return NextResponse.json({ success: true, doctors }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
