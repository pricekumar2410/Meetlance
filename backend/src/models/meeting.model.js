import mongoose, { Schema } from "mongoose";


const meetingSchema = new Schema({
    user_id: { type: String },
    meetingCode: { type: String, required: true },
    interviewName: { type: String, default: "" },
    date: { type: Date, default: Date.now, required: true }
});

const Meeting = mongoose.model("Meeting", meetingSchema);

export { Meeting }