import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Kid from "@/models/Kid";

export async function GET() {
  try {
    await connectDB();

    const totalKids = await Kid.countDocuments();

    return NextResponse.json(
      { success: true, totalKids },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch count" },
      { status: 500 }
    );
  }
}
