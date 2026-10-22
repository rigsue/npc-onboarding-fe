const API_URL = import.meta.env.VITE_NPC_ONBOARDING_PLATFORM;

export async function createModule(token, moduleData) {
    const response = await fetch(
        `{API_URL}/modules/create-module`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(moduleData),
        }
    );
    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Failed to create learning module");
    }
    return result;
}


export async function getModules(token) {
    const response = await fetch(`${API_URL}/module/get-modules`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch learning modules");
    }

    return data;
}


export async function updateModule(token, learnModId, moduleData) {
    const response = await fetch(
        `${API_URL}/module/${learnModId}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(moduleData),
        }
    );
    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Failed to update module");
    }
    return result;
}


export async function updateModuleStat(token, learnModId, isActive) {
    const response = await fetch(
        `${API_URL}/module/${learnModId}/status`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer${token}`,
            },
            body: JSON.stringify({ isActive },)
        }
    );
    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || " Failed to update mod status");
    }
    return result;
}