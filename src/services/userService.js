const API_URL =
  import.meta.env.VITE_NPC_ONBOARDING_PLATFORM;

//  -   -   CREATE USER -   -
export async function registerUser(token, userData) {
  const response = await fetch(
    `${API_URL}/user/create-user`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "User registration failed"
    );
  }

  return data;
}

//  -   -   GET USERS   -   -
export async function getUsers(token) {
  const response = await fetch(
    `${API_URL}/user/get-users`,
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
      data.message || "Failed to fetch users"
    );
  }

  return data;
}

// UPDATE USER
export async function updateUser(
  token, id, userData
) {
  const response = await fetch(
    `${API_URL}/user/${id}/update-user`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("Update user API error:", data);
    
    throw new Error(
      data.message || "User update failed"
    );
  }
  return data;
/*   if (!response.ok) {
    const errorData = await response.json();
    console.error("Update user API error:", errorData);
    throw new Error(errorData.message || "User update failed");
} */
}

// DEACTIVATE USER
export async function deactivateUser(
  token, userId
) {
  const response = await fetch(
    `${API_URL}/user/${userId}/deactivate`,
    {
      method: "PATCH",

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to deactivate user"
    );
  }
  return data;
}

// ACTIVATE USER
export async function activateUser(
  token, userId
) {
  const response = await fetch(
    `${API_URL}/user/${userId}/activate`,
    {
      method: "PATCH",

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to activate user"
    );
  }
  return data;
}