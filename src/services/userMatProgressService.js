
const API_URL = import.meta.env.VITE_NPC_ONBOARDING_PLATFORM;
const MAT_PROGRESS_URL = `${API_URL.replace(/\/+$/, "")}/user-mat-progress`;

async function handleResponse(response, fallbackMessage) {
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || fallbackMessage);
    }

    return data;
}

// Retrieve authenticated user's learning material progress
export async function getMyMaterialProgress(token) {
    const response = await fetch(`${MAT_PROGRESS_URL}/me`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return handleResponse(
        response,
        "Failed to retrieve your material progress"
    );
}
