import mongoose from "mongoose";
const { Schema } = mongoose;

const reviewSchema = new Schema(
  {
    user: { type: String, ref: "User", required: true },
    room: { type: String, ref: "Room", required: true },
    hotel: { type: String, ref: "Hotel", required: true },
    booking: { type: String, ref: "Booking", required: true},
    rating: { type: Number, required: true, min : 1, max : 5},
    comment: { type: String, required: true, maxLength: 500},
    createdAt: { type: Date }
  }, 
  { timestamps: true }
);

reviewSchema.index({room: 1});
reviewSchema.index({hotel: 1});

const Review = mongoose.model("Review", reviewSchema);

export default Review