const API_URL = import.meta.env.VITE_NPC_ONBOARDING_PLATFORM;

export async function getDepartments(token) {
    const response = await fetch(`${API_URL}/department/get-departments`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const data = await response.json();

    if(!response.ok) {
        throw new Error(data.message || "Failed to fetch departmens");
    }
    return data;
}