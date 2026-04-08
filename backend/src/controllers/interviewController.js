import Interview from "../models/interview.model.js";

export const getInterviewHistory = async (req, res) => {
    try {
        const interview = await Interview.find()
            .sort({ "sessionInfo.createdAt": -1 });

        res.status(200).json(interview);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};