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

export async function getMaterialsByDept(token) {
    const response = await fetch(`${MATERIAL_URL}/get-materials/department`, {
        method: "GET", 
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });   
    const result = await response.json();

    if(!response.ok) {
        throw new Error(result.message || "Failed to retrieve dept mats");
    }
    return result;
}


export async function updateMaterial(token, learnMatId, formData) {
    const response = await fetch(`${API_URL}/material/${learnMatId}`, {
        method: "PUT",
        headers: {
            // "Content-Type": "application/json",
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

// construct material file url
export const getMaterialUrl = (material) => {
    const filePath = material.content_url.trim();

    if(!filePath) return "";

    // Already absulute url
    if(/^https?:\/\//i.test(filePath)) {
        return filePath;
    }
    const cleanPath = filePath.replace(/^\/+/, "");

    return `${API_URL.replace(/\/+$/, "")}/${cleanPath}`;
}
// retrieve mat file
export async function getMaterialFile(token, material) {
    
    const fileUrl = getMaterialUrl(material);

    if(!fileUrl) {
        throw new Error("missint material file");
    }
    const response = await fetch(fileUrl, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    console.log("Status:", response.status);
    console.log("Content-type", response.headers.get("content-type"));
    
    if (!response.ok) {
        throw new Error("Unable to retrive learn mat");
    }
    // return await response.blob();
    const blob = await response.blob();

    console.log("Blob type:", blob.type);
    console.log("Blob size:", blob.size);

    return blob;
}