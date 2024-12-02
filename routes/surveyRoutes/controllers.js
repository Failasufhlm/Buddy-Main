const admin = require('firebase-admin');
const db = admin.firestore();
const auth = admin.auth();

// Validation middleware
const validateToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split('Bearer ')[1];
        if (!token) throw new Error('No token provided');
        
        const decodedToken = await auth.verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

// Get all survey questions
const getSurveyQuestions = async (req, res) => {
    try {
        const questionsSnapshot = await db.collection('survey_questions').get();
        const questions = [];
        questionsSnapshot.forEach(doc => {
            questions.push({
                id: doc.id,
                ...doc.data()
            });
        });
        res.status(200).json({ questions });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Submit survey answers
const submitSurveyAnswers = async (req, res) => {
    try {
        const { userId, answers } = req.body;
        
        // Calculate mental health score based on answers
        const score = calculateMentalHealthScore(answers);
        
        // Save survey response
        await db.collection('survey_responses').add({
            userId,
            answers,
            score,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });

        res.status(200).json({
            message: "Survey submitted successfully",
            score
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get survey results
const getSurveyResults = async (req, res) => {
    try {
        const { userId } = req.params;
        const resultsSnapshot = await db.collection('survey_responses')
            .where('userId', '==', userId)
            .orderBy('timestamp', 'desc')
            .get();
        
        const results = [];
        resultsSnapshot.forEach(doc => {
            results.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        res.status(200).json({ results });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create new survey
const createSurvey = async (req, res) => {
    try {
        const { questions } = req.body;
        
        // Add questions to database
        const batch = db.batch();
        questions.forEach(question => {
            const questionRef = db.collection('survey_questions').doc();
            batch.set(questionRef, question);
        });
        
        await batch.commit();
        res.status(200).json({ message: "Survey created successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Helper function to calculate mental health score
const calculateMentalHealthScore = (answers) => {
    let anxietyScore = 0;
    let depressionScore = 0;
    let stressScore = 0;
    let ptsdScore = 0;
    let socialAnxietyScore = 0;

    answers.forEach(answer => {
        switch(answer.category) {
            case 'anxiety':
                anxietyScore += parseInt(answer.score);
                break;
            case 'depression':
                depressionScore += parseInt(answer.score);
                break;
            case 'stress':
                stressScore += parseInt(answer.score);
                break;
            case 'ptsd':
                ptsdScore += parseInt(answer.score);
                break;
            case 'social_anxiety':
                socialAnxietyScore += parseInt(answer.score);
                break;
        }
    });

    const recommendations = generateRecommendations(
        anxietyScore, 
        depressionScore, 
        stressScore, 
        ptsdScore, 
        socialAnxietyScore
    );

    return {
        overall: (anxietyScore + depressionScore + stressScore + ptsdScore + socialAnxietyScore) / 5,
        categories: {
            anxiety: anxietyScore,
            depression: depressionScore,
            stress: stressScore,
            ptsd: ptsdScore,
            social_anxiety: socialAnxietyScore
        },
        severity: calculateSeverityLevel(anxietyScore, depressionScore, stressScore, ptsdScore, socialAnxietyScore),
        recommendations: recommendations
    };
};

const calculateSeverityLevel = (anxiety, depression, stress) => {
    const avgScore = (anxiety + depression + stress) / 3;
    if (avgScore <= 25) return "Normal";
    if (avgScore <= 50) return "Mild";
    if (avgScore <= 75) return "Moderate";
    return "Severe";
};

const generateRecommendations = (anxiety, depression, stress, ptsd, socialAnxiety) => {
    const recommendations = [];
    
    if (anxiety > 50) {
        recommendations.push({
            type: 'anxiety',
            activities: [
                'Latihan pernapasan dalam',
                'Meditasi mindfulness',
                'Konsultasi dengan psikolog spesialis anxiety'
            ]
        });
    }
    
    if (depression > 50) {
        recommendations.push({
            type: 'depression',
            activities: [
                'Olahraga ringan secara rutin',
                'Terapi cahaya',
                'Konsultasi dengan psikiater'
            ]
        });
    }
    
    if (stress > 50) {
        recommendations.push({
            type: 'stress',
            activities: [
                'Yoga',
                'Journaling',
                'Time management workshop'
            ]
        });
    }
    
    if (ptsd > 50) {
        recommendations.push({
            type: 'ptsd',
            activities: [
                'EMDR therapy',
                'Support group therapy',
                'Trauma-focused CBT'
            ]
        });
    }
    
    if (socialAnxiety > 50) {
        recommendations.push({
            type: 'social_anxiety',
            activities: [
                'Exposure therapy',
                'Social skills training',
                'Group therapy sessions'
            ]
        });
    }
    
    return recommendations;
};

module.exports = {
    getSurveyQuestions,
    submitSurveyAnswers,
    getSurveyResults,
    createSurvey,
    validateToken
};