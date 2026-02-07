import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Kid from "@/models/Kid";
import { pusher } from "@/lib/pusher";

export async function POST(req) {
  try {
    await connectDB();

    const { kidId } = await req.json();

    if (!kidId) {
      return NextResponse.json(
        { success: false, message: "Missing kid ID" },
        { status: 400 }
      );
    }

    const kid = await Kid.findById(kidId);

    if (!kid) {
      return NextResponse.json(
        { success: false, message: "Kid not found" },
        { status: 404 }
      );
    }

    // Set 'played' to false for ALL games
    kid.games.forEach((game) => {
      game.played = false;
    });

    await kid.save();

    // Trigger pusher update
    await pusher.trigger("kids-score", "score-updated", {
      kidId,
      action: "replay-all",
    });

    return NextResponse.json({
      success: true,
      message: "All games reset for replay 🔄",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}