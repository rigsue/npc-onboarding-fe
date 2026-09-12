const API_URL = import.meta.env.VITE_NPC_ONBOARDING_PLATFORM;

export async function loginUser(email, password) {

    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password
        }),
    });
    const data = await response.json();

    if(!response.ok) {
        throw new Error(data.message || "Login failed");
    }
    return data;
}

export async function logoutUser(token) {
    const response = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const data = await response.json();

    if(!response.ok) {
        throw new Error(data.message || "Logout failed");
    }
    return data;
}

export async function refreshToken(params) {
    
}

export async function getCurrentUser(params) {
    
}