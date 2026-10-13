const API_URL = import.meta.env.VITE_NPC_ONBOARDING_PLATFORM;

export async function getMaterials(token) {
    const response = await fetch(`${API_URL}material/get-materials`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const result = await response.json();

    if(!response.ok) {
        throw new Error(result.message || "Failed to retrieve materials");
    }
    return result;
}

export async function createMaterials(token, payload) {
    const response = await fetch(`${API_URL}/material/create-material`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });
    
    const result = await response.json();

    if(!response.ok) {
        throw new Error(result.message || "Failed to create materials");
    }
    return result;
}

export async function uploadMaterials(token, {
    files, linkModule, note
}) {
    const formData = new FormData();

    formData.append("learnModId", linkModule);
    formData.append("description", note);

    for (const file of files) {
        formData.append("files", file);
    }
    const response = await fetch(
        `${API_URL}/material/create-material`,
        {
            method: "POST", 
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData
        }
    );
    const data = await response.json();

    if(!response.ok) {
        throw new Error(data.message || "Failed to upload materials");
    }
    return data;
}