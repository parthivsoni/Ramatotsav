import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/db";
import Kid from "@/models/Kid";
import Games from "@/data/Games";
import { pusher } from "@/lib/pusher";

export async function POST(req) {
  try {
    await connectDB();

    const formData = await req.formData();

    const file = formData.get("image");
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const age = Number(formData.get("age"));
    const std = formData.get("std"); // Get std
    const sabha = formData.get("sabha");
    const mobile = formData.get("mobile") || "";
    const address = formData.get("address") || "";

    // Added std to validation check
    if (!file || !firstName || !lastName || !age || !sabha || !std) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    /* ---------- Upload Image to Cloudinary ---------- */
    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            upload_preset: "balakImages",
            folder: "balak_images",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    const initialGames = Games.map((game) => ({
      name: game.name,
      played: false,
      score: 0,
    }));

    const kid = await Kid.create({
      firstName,
      lastName,
      age,
      std,
      sabha,
      mobile,
      address,
      pictureUrl: uploadResult.secure_url,
      totalScore: 0,
      games: initialGames,
    });

    await pusher.trigger("kids-channel", "kid-added", {
      refresh: true,
    });

    return NextResponse.json({ success: true, kid }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}