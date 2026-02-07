import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Kid from "@/models/Kid";

export async function POST(req) {
  try {
    await connectDB();
    const { kidId, gameName, score } = await req.json();

    // Log for debugging
    console.log(`Updating Kid: ${kidId}, Game: "${gameName}", Score: ${score}`);

    const updatedKid = await Kid.findOneAndUpdate(
      { _id: kidId, "games.name": gameName }, // Filter
      { 
        $set: { 
          "games.$.played": true, 
          "games.$.score": score 
        },
        $inc: { totalScore: score }
      },
      { new: true }
    );

    if (!updatedKid) {
      // Check if the kid even exists without the game filter
      const kidExists = await Kid.findById(kidId);
      if (!kidExists) return NextResponse.json({ error: "Kid ID not found" }, { status: 404 });
      
      return NextResponse.json({ 
        success: false, 
        error: `Game "${gameName}" not found in this kid's games array.` 
      }, { status: 404 });
    }

    return NextResponse.json({ success: true, kid: updatedKid });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}