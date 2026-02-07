import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Kid from "@/models/Kid";

export async function GET() {
  try {
    await connectDB();

    const kids = await Kid.find().sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, kids },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch kids" },
      { status: 500 }
    );
  }
}
