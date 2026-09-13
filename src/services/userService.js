
const API_URL = import.meta.env.VITE_NPC_ONBOARDING_PLATFORM;

export async function registerUser(token, userData) {
    const response = await fetch(`${API_URL}/user/create-user`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
    });
    const data = await response.json();

    if(!response.ok) {
        throw new Error (data.message || "User Registration failed");
    }
    return data;
}


export async function getUsers(token) {
    const response = await fetch(`${API_URL}/user/get-users`,{
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const data = await response.json();

    if(!response.ok) {
        throw new Error(data.message || "Failed to fetch users");
    }
    return data;
}

/* 

export async function getUser(params) {
    
}

export async function updateUser(params) {
    
}
*/
export async function deactivateUser(token, userId) {
    const response = await fetch(
        `${API_URL}/user/${userId}/deactivate`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(userId),
        }
    );
    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to deactivate user"
        );
    }
    return data;
} 

export async function activateUser(token, userId) {
    const response = await fetch(
        `${API_URL}/user/${userId}/activate`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`
            },
            // body: JSON.stringify(userId),
        }
    );
    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to activate user"
        );
    }
    return data;
}