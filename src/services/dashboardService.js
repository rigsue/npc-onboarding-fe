const API_URL =
  import.meta.env.VITE_NPC_ONBOARDING_PLATFORM;

async function apiRequest(endpoint, token) {
    const response = await fetch(
        `${API_URL}${endpoint}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result?.message ||
            `Request failed with status ${response.status}`
        );
    }

    return result;
}

export async function getUsers(token) {
    const result = await apiRequest(
        "/user/get-users",
        token
    );

    return result?.data ?? [];
}

export async function getModules(token) {
    const result = await apiRequest(
        "/module/get-modules",
        token
    );

    return result?.data ?? [];
}

export async function getUserProgress(token) {
    const result = await apiRequest(
        "/user-progress/get-user-progress",
        token
    );

    return result?.data ?? [];
}

export async function getExams(token) {
    const result = await apiRequest(
        "/exam/get-exam",
        token
    );

    return result?.data ?? [];
}

export async function getExamAttempts(token) {
    const result = await apiRequest(
        "/exam-attempt/get-all-ex-att",
        token
    );

    return result?.data ?? [];
}

export async function getAdminDashboardData(token) {
    const [
        users,
        modules,
        userProgress,
        exams,
        examAttempts,
    ] = await Promise.all([
        getUsers(token),
        getModules(token),
        getUserProgress(token),
        getExams(token),
        getExamAttempts(token),
    ]);

    return {
        users,
        modules,
        userProgress,
        exams,
        examAttempts,
    };
}