
const API_URL = import.meta.env.VITE_NPC_ONBOARDING_PLATFORM;
const CHOICE_URL = `${API_URL.replace(/\/+$/, "")}/choice`;

async function handleResponse(response, fallbackMessage) {
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || fallbackMessage);
    }

    return data;
}

// Retrieve all choices
export async function getAllChoices(token) {
    const response = await fetch(`${CHOICE_URL}/get-choice`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return handleResponse(response, "Failed to fetch choices");
}

// Retrieve choices belonging to a specific question
export async function getChoicesByQuestion(token, questionId) {
    const response = await fetch(`${CHOICE_URL}/question/${questionId}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return handleResponse(response, "Failed to fetch question choices");
}

// Retrieve one choice by ID
export async function getChoiceById(token, choiceId) {
    const response = await fetch(`${CHOICE_URL}/${choiceId}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return handleResponse(response, "Failed to fetch choice");
}

// Create a choice
export async function createChoice(token, choiceData) {
    const response = await fetch(`${CHOICE_URL}/create-choices`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(choiceData),
    });

    return handleResponse(response, "Failed to create choice");
}

// Update a choice
export async function updateChoice(token, choiceId, choiceData) {
    const response = await fetch(`${CHOICE_URL}/${choiceId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(choiceData),
    });

    return handleResponse(response, "Failed to update choice");
}

// Activate or deactivate a choice
export async function updateChoiceStatus(token, choiceId, isActive) {
    const response = await fetch(`${CHOICE_URL}/${choiceId}/status`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive }),
    });

    return handleResponse(response, "Failed to update choice status");
}
