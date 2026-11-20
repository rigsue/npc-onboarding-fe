const API_URL = import.meta.env.VITE_NPC_ONBOARDING_PLATFORM;

export async function departmentRequest(endpoint, token, options = {}) {
    const response = await fetch(`${API_URL}/department${endpoint}`, {
        ...options,
        headers: {
            Authorization: `Bearer ${token}`,
            ...(options.body && {
                "Content-Type": "application/json"
            }),
            ...options.headers
        }
    });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Department request failed");
    }
    return data;
}

//  Get All departments
export async function getDepartments(token) {
    return departmentRequest("/get-departments", token);
}

// Get department by id
export async function getDeptById(departmentId, token) {
    return departmentRequest(`/${departmentId}`, token);
}

// Create department
export async function createDept(department, token) {
    return departmentRequest("/create-department", token, {
        method: "POST",
        body: JSON.stringify(department)
    });
}

// Update Department
export async function updateDept(departmentId, department, token) {
    return departmentRequest(`/${departmentId}`, token, {
        method: "PUT",
        body: JSON.stringify(department)
    });
}

// Deactivate department
export async function deactivateDept(departmentId, token) {
    return departmentRequest(`/${departmentId}/deactivate`, token, {
        method: "PATCH"
    });
}

// Activate department
export async function activateDept(departmentId, token) {
    return departmentRequest(`/${departmentId}/activate`, token, {
        method: "PATCH"
    });
}

// Get users under department
export async function getDeptUsers(departmentId, token) {
    return departmentRequest(`/${departmentId}/users`, token);
}