  import mongoose from "mongoose";

  const GameSchema = new mongoose.Schema({
    name: { type: String, required: true },
    played: { type: Boolean, default: false },
    score: { type: Number, default: 0 },
  });

  const KidSchema = new mongoose.Schema(
    {
      firstName: { type: String, required: true, trim: true },
      lastName: { type: String, required: true, trim: true },
      age: { type: Number, required: true, min: 1, max: 18 },
      // Added 'std' field here
      std: {
        type: String,
        required: true,
        enum: [
          "Playgroup",
          "JKG",
          "SKG",
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
        ],
      },
      sabha: {
        type: String,
        required: true,
        enum: [
          "Sarangpur",
          "Raipur Sanskardham",
          "Raipur Sanskardham Shishu",
          "Raipur - 2",
          "New Entry"
        ],
      },
      mobile: { type: String },
      address: { type: String, default: "" },
      pictureUrl: { type: String, required: true },
      totalScore: { type: Number, default: 0 },
      games: [GameSchema],
    },
    {
      timestamps: true,
    }
  );

  export default mongoose.models.Kid || mongoose.model("Kid", KidSchema);