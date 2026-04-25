import express from 'express';
import Interview from '../models/interview.model.js';
import { getInterviewHistory } from "../controllers/interviewController.js";
import crypto from 'crypto';

const router = express.Router();

// Create interview session (Interviewer)
router.post('/create-session', async (req, res) => {
    try {
        const { sessionCode, interviewerName, interviewerUsername, interviewerId } = req.body;

        if (!sessionCode || !interviewerName || !interviewerUsername || !interviewerId) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Check if session code already exists
        const existingSession = await Interview.findOne({ 'sessionInfo.sessionCode': sessionCode });
        if (existingSession) {
            return res.status(400).json({ message: 'Session code already exists' });
        }

        const newSession = new Interview({
            interviewId: crypto.randomBytes(16).toString('hex'),
            sessionInfo: {
                sessionCode,
                createdAt: new Date(),
                isLocked: false,
                participants: 1
            },
            interviewerInfo: {
                id: interviewerId,
                name: interviewerName,
                username: interviewerUsername,
                email: '',
                joinedAt: new Date()
            },
            studentInfo: null,
            status: 'waiting'
        });

        const savedSession = await newSession.save();
        res.status(201).json({
            message: 'Session created successfully',
            sessionId: savedSession.interviewId,
            sessionCode: sessionCode
        });
    } catch (error) {
        console.error('Create session error:', error);
        res.status(500).json({ message: 'Error creating session', error: error.message });
    }
});

// Join interview session (Candidate)
router.post('/join-session', async (req, res) => {
    try {
        const { sessionCode, candidateName, candidateUsername, candidateId } = req.body;

        if (!sessionCode || !candidateName || !candidateUsername || !candidateId) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const session = await Interview.findOne({ 'sessionInfo.sessionCode': sessionCode });

        if (!session) {
            return res.status(404).json({ message: 'Session not found. Invalid code.' });
        }

        if (session.status === 'completed') {
            return res.status(400).json({ message: 'Session already completed' });
        }

        if (session.sessionInfo.isLocked) {
            return res.status(403).json({ message: 'Session is locked. Cannot join.' });
        }

        if (session.sessionInfo.participants >= 2) {
            return res.status(403).json({ message: 'Session is full. Only 2 participants allowed.' });
        }

        // Add student and lock session
        session.studentInfo = {
            id: candidateId,
            name: candidateName,
            username: candidateUsername,
            email: '',
            joinedAt: new Date()
        };
        session.status = 'ongoing';
        session.sessionInfo.isLocked = true;
        session.sessionInfo.participants = 2;
        session.startTime = new Date();

        const updatedSession = await session.save();

        res.status(200).json({
            message: 'Joined session successfully',
            sessionId: updatedSession.interviewId,
            sessionCode: sessionCode
        });
    } catch (error) {
        console.error('Join session error:', error);
        res.status(500).json({ message: 'Error joining session', error: error.message });
    }
});

// Get session info
router.get('/session/:sessionCode', async (req, res) => {
    try {
        const session = await Interview.findOne({ 'sessionInfo.sessionCode': req.params.sessionCode });

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        res.status(200).json({
            sessionId: session.interviewId,
            sessionCode: session.sessionInfo.sessionCode,
            interviewer: session.interviewerInfo,
            candidate: session.studentInfo,
            status: session.status,
            isLocked: session.sessionInfo.isLocked
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching session', error: error.message });
    }
});

// End session
router.post('/:interviewId/end-session', async (req, res) => {
    try {
        const session = await Interview.findOneAndUpdate(
            { interviewId: req.params.interviewId },
            {
                status: 'completed',
                endTime: new Date(),
                updatedAt: Date.now()
            },
            { new: true }
        );

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        res.status(200).json({
            message: 'Session ended',
            session
        });
    } catch (error) {
        res.status(500).json({ message: 'Error ending session', error: error.message });
    }
});

// Get sessions for user
router.get('/user/:userId', async (req, res) => {
    try {
        const sessions = await Interview.find({
            $or: [
                { 'interviewerInfo.id': req.params.userId },
                { 'studentInfo.id': req.params.userId }
            ]
        });

        res.status(200).json(sessions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching sessions', error: error.message });
    }
});

// history get
router.get("/history/:userId", getInterviewHistory);

export default router;