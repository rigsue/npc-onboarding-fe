const API_URL = import.meta.env.VITE_NPC_ONBOARDING_PLATFORM;
const BASE_URL = API_URL.replace(/\/+$/, "");
const EXAM_URL = `${BASE_URL}/exam`;

async function handleResponse(response, fallbackMessage) {
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || fallbackMessage);
    }
    return data;
}

// Get all exams
export async function getExam(token) {
    const response = await fetch(`${EXAM_URL}/get-exams`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    return handleResponse(response, "Failed to fetch all exams");
}

// Get Exam By Module
export async function getExamByMod(token, learnModId) {
    const response = await fetch (
        `${EXAM_URL}/module/${learnModId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    return handleResponse(response, "Failed to fetch exam by module");
}

// Get Exam By ID
export async function getExamById(token, examId) {
    const response = await fetch(
        `${EXAM_URL}/${examId}/get-exam`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    return handleResponse(response, "Failed to fetch exam By ID");
}

// Create Exams
export async function createExam(token, examData) {
    const response = await fetch(`${EXAM_URL}/create-exam`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(examData),
    });
    return handleResponse(response, "Failed to create assessent");
}

// Update Exam Details
export async function updateExam(token, examId, examData) {
    const response = await fetch(`${EXAM_URL}/${examId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(examData),
    });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to update assessment");
    }
    return data;
}

// Update Exam Status
export async function updateExamStatus(token, examId, isActive) {
    const response = await fetch(`${EXAM_URL}/${examId}/stats`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive }),
    });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to update assessment status");
    }
    return data;
}
