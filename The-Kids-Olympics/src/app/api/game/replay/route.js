import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Kid from "@/models/Kid";
import { pusher } from "@/lib/pusher";

export async function POST(req) {
  try {
    await connectDB();

    const { kidId, gameName } = await req.json();

    if (!kidId || !gameName) {
      return NextResponse.json(
        { success: false, message: "Missing data" },
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

    const game = kid.games.find((g) => g.name === gameName);

    if (!game) {
      return NextResponse.json(
        { success: false, message: "Game not found" },
        { status: 404 }
      );
    }

    
    game.played = false;

    await kid.save();
    await pusher.trigger("kids-score", "score-updated", {
      kidId,
      gameName,
      action: "replay",
    });

    return NextResponse.json({
      success: true,
      message: "Game replay enabled",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
