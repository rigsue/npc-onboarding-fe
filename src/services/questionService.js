
const API_URL = import.meta.env.VITE_NPC_ONBOARDING_PLATFORM;
const QUESTION_URL = `${API_URL.replace(/\/+$/, "")}/question`;

async function handleResponse(response, fallbackMessage) {
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || fallbackMessage);
    }

    return data;
}

// Retrieve all questions
export async function getAllQuestions(token) {
    const response = await fetch(`${QUESTION_URL}/get-question`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return handleResponse(response, "Failed to fetch questions");
}

// Retrieve questions belonging to a specific exam
export async function getQuestionsByExam(token, examId) {
    const response = await fetch(`${QUESTION_URL}/exam/${examId}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return handleResponse(response, "Failed to fetch exam questions");
}

// Retrieve one question by ID
export async function getQuestionById(token, questionId) {
    const response = await fetch(`${QUESTION_URL}/${questionId}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return handleResponse(response, "Failed to fetch question");
}

// Create a question
export async function createQuestion(token, questionData) {
    const response = await fetch(`${QUESTION_URL}/create-question`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(questionData),
    });

    return handleResponse(response, "Failed to create question");
}

// Update a question
export async function updateQuestion(token, questionId, questionData) {
    const response = await fetch(`${QUESTION_URL}/${questionId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(questionData),
    });

    return handleResponse(response, "Failed to update question");
}

// Activate or deactivate a question
export async function updateQuestionStatus(token, questionId, isActive) {
    const response = await fetch(`${QUESTION_URL}/${questionId}/status`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive }),
    });

    return handleResponse(response, "Failed to update question status");
}
