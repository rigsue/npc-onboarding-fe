const API_URL =
  import.meta.env.VITE_NPC_ONBOARDING_PLATFORM;

export async function getRoles(token) {
  const response = await fetch(
    `${API_URL}/role/get-roles`,
    {
      method: "GET",

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch roles"
    );
  }

  return data;
}

// GET current user role
export async function getRoleById(token, roleId) {
  const response = await fetch(
    `${API_URL}/role/${roleId}/role`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("getRoleById failed:", {
      status: response.status, roleId, data,
    });
    throw new Error(
      data.message || "Failed to fetch user"
    );
  }

  return data;
}