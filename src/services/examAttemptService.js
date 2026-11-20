
const API_URL = import.meta.env.VITE_NPC_ONBOARDING_PLATFORM;

const EXAM_ATTEMPT_URL =
    `${API_URL.replace(/\/+$/, "")}/exam-attempt`;

const EXAM_ATTEMPT_ANS_URL =
    `${API_URL.replace(/\/+$/, "")}/exam-attempt-ans`;

// Shared response handler
async function handleResponse(response) {
    const data = await response.json();

    if (!response.ok) {
        console.error("API Error Response:", data);
        throw new Error(
            data.message || "An error occurred while processing the request."
        );
    }
    return data;
}

// Create a new assessment attempt
export async function createExamAttempt(token, examId) {
    const response = await fetch(`${EXAM_ATTEMPT_URL}/`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ examId }),
    });

    return handleResponse(response);
}

// Save an individual answer
export async function createExamAttemptAnswer(token, answerData) {
    const response = await fetch(`${EXAM_ATTEMPT_ANS_URL}/`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(answerData),
    });

    return handleResponse(response);
}

// Retrieve attempts by user progress
export async function getExamAttemptsByUserProgress(token, userProgressId) {
    const response = await fetch(
        `${EXAM_ATTEMPT_URL}/progress/${userProgressId}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return handleResponse(response);
}

// Update an attempt's status (Admin/Super Admin)
export async function updateExamAttemptStatus(token, attemptId, status) {
    const response = await fetch(
        `${EXAM_ATTEMPT_URL}/${attemptId}/stats`,
        {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status }),
        }
    );

    return handleResponse(response);
}

// Close an active attempt (authenticated owner)
export async function closeExamAttempt(token, attemptId) {
    const response = await fetch(
        `${EXAM_ATTEMPT_URL}/${attemptId}/close`,
        {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        }
    );

    return handleResponse(response);
}
