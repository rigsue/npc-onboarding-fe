const API_URL = import.meta.env.VITE_NPC_ONBOARDING_PLATFORM;
const MATERIAL_URL = `${API_URL.replace(/\/+$/, "")}/material`;

export async function uploadMaterials(token, {
    files,
    linkedModule,
    note,
    title,
    materialType = "document",
    displayOrder = null,
    minDurationMinutes = 5,
    maxDurationMinutes = 30
}) {
    const formData = new FormData();

    formData.append("learnModId", linkedModule);
    formData.append("title", title);
    formData.append("description", note);
    formData.append("materialType", materialType);
    // formData.append("displayOrder", displayOrder);
    formData.append("minDurationMinutes", minDurationMinutes);
    formData.append("maxDurationMinutes", maxDurationMinutes);

    if (displayOrder !== null && displayOrder !== "") {
        formData.append("displayOrder", displayOrder);
    }

    for (const file of files) {
        formData.append("files", file);
    }

    const response = await fetch(
        `${MATERIAL_URL}/create-material`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message || "Failed to upload materials"
        );
    }

    return result;
}

export async function getMaterials(token) {
    const response = await fetch(`${MATERIAL_URL}/get-materials`, {
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


export async function updateMaterial(token, learnMatId, formData) {
    const response = await fetch(`${API_URL}/material/${learnMatId}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to update material");
    }
    return data;
}

export async function updateMaterialStatus(token, isActive, learnMatId) {
    const response = await fetch(
        `${API_URL}/material/${learnMatId}/status`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ isActive }),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to update material status");
    }
    return data;
}

