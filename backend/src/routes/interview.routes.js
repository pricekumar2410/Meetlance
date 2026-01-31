import express from 'express';
import { createInterview, getInterviewByCode, getHistory } from '../controllers/interview.controller.js';

const router = express.Router();

router.post('/create', createInterview);
router.get('/code/:code', getInterviewByCode);
router.get('/history', getHistory);

export default router;