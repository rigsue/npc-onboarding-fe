const API_URL = import.meta.env.VITE_NPC_ONBOARDING_PLATFORM;

export async function getRoles(token) {
    const response = await fetch(`${API_URL}/role/get-role`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const data = await response.json();

    if(!response.ok) {
        throw new Error(data.message || "Failed to fetch roles");
    }
    return data;
}