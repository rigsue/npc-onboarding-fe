const API_URL = import.meta.env.VITE_NPC_ONBOARDING_PLATFORM;
const MATERIAL_URL = `${API_URL.replace(/\/+$/, "")}/material`;

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
/* 
export async function createMaterials(token, payload) {

    try {
        console.log(" = = Material upload to backend = = ");
        console.log("Request received:", req.method, req.originalUrl);
        console.log("Request content type:", req.headers["content-type"]);
        console.log("Request body:", req.body);
        console.log("Upload files:", req.files);

      const response = await fetch(`${MATERIAL_URL}/create-material`, {
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
    } catch (error) {
    next(error);
    }
}
 */
/* export async function uploadMaterials(token, {
    files, linkedModule, note
}) {
    const formData = new FormData();

    formData.append("learnModId", linkedModule);
    formData.append("description", note);

    for (const file of files) {
        formData.append("files", file);
    }
        // FormData entries can be inspected this way.
    for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
        console.log(`${key}:`, {
            name: value.name,
            type: value.type,
            size: value.size,
        });
        } else {
        console.log(`${key}:`, value);
        }
    }
    const response = await fetch(
        `${MATERIAL_URL}/create-material`,
        {
            method: "POST", 
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData
        }
    );
    console.log("HTTP response status:", response.status);
    console.log("HTTP response OK:", response.ok);

    const data = await response.json();

    console.log("Backend response:", data);

    if(!response.ok) {
        throw new Error(data.message || "Failed to upload materials");
    }
    return data;
} */

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
