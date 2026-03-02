import mongoose from "mongoose";

// Interview/Session Schema
const interviewSchema = new mongoose.Schema({
    interviewId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    sessionInfo: {
        sessionCode: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        isLocked: {
            type: Boolean,
            default: false
        },
        participants: {
            type: Number,
            default: 0
        }
    },
    interviewerInfo: {
        id: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        username: {
            type: String
        },
        email: {
            type: String
        },
        joinedAt: {
            type: Date
        }
    },
    studentInfo: {
        id: {
            type: String
        },
        name: {
            type: String
        },
        username: {
            type: String
        },
        email: {
            type: String
        },
        joinedAt: {
            type: Date
        }
    },
    status: {
        type: String,
        enum: ['waiting', 'ongoing', 'completed', 'cancelled'],
        default: 'waiting'
    },
    startTime: {
        type: Date
    },
    endTime: {
        type: Date
    },
    codeSubmitted: {
        language: String,
        code: String,
        submittedAt: Date
    },
    feedback: {
        rating: Number,
        comments: String,
        submittedAt: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export default mongoose.model('Interview', interviewSchema);
