import { Meeting } from '../models/meeting.model.js';
import crypto from 'crypto';

const generateCode = () => {
    return crypto.randomBytes(3).toString('hex').toUpperCase();
}

export const createInterview = async (req, res) => {
    try {
        let { interviewName, meetingCode } = req.body;
        meetingCode = meetingCode ? meetingCode.trim() : generateCode();

        while (await Meeting.findOne({ meetingCode })) {
            meetingCode = generateCode();
        }

        const meeting = new Meeting({ meetingCode, interviewName, user_id: req.body.user_id || '' });
        await meeting.save();

        res.json({ success: true, data: meeting });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

export const getInterviewByCode = async (req, res) => {
    try {
        const { code } = req.params;
        const meeting = await Meeting.findOne({ meetingCode: code });
        if (!meeting) return res.status(404).json({ success: false, message: 'Interview not found' });
        res.json({ success: true, data: meeting });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

export const getHistory = async (req, res) => {
    try {
        const meetings = await Meeting.find().sort({ date: -1 }).limit(50);
        res.json({ success: true, data: meetings });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}