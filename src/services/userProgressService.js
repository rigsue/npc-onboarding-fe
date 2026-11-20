const API_URL = import.meta.env.VITE_NPC_ONBOARDING_PLATFORM;
const PROGRESS_URL = `${API_URL.replace(/\/+$/, "")}/user-progress`;

export async function getMyUserProgress(token) {
    const response = await fetch(`${PROGRESS_URL}/me`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to retrieve progress");
    }

    return data;
}