const express = require('express');
const router = express.Router();
const { 
    getSurveyQuestions,
    submitSurveyAnswers,
    getSurveyResults,
    createSurvey
} = require('./controllers');

// Get all survey questions
router.get('/questions', getSurveyQuestions);

// Submit survey answers
router.post('/submit', submitSurveyAnswers);

// Get survey results
router.get('/results/:userId', getSurveyResults);

// Create new survey (admin only)
router.post('/create', createSurvey);

module.exports = router;
