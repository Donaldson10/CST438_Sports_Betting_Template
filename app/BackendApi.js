const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://project2-438-backend-c8e29941b290.herokuapp.com"
    : "http://localhost:8080";

export const callBackendAPI = async (endpoint, setJsonResponse) => {
  try {
    const url = `${BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const json = await response.json();
    if (setJsonResponse) setJsonResponse(json);
    return json;
  } catch (error) {
    console.error("Error calling backend API:", error);
    if (setJsonResponse) setJsonResponse(null);
    return null;
  }
};

// Example functions to call backend endpoints
export const getAllTeams = async () => {
  try {
    return await callBackendAPI("/teams");
  } catch (error) {
    console.error("Error fetching teams:", error);
    return [];
  }
};

export const getAllGames = async () => {
  try {
    return await callBackendAPI("/games");
  } catch (error) {
    console.error("Error fetching games:", error);
    return [];
  }
};

export const getGameById = async (id) => {
  try {
    return await callBackendAPI(`/games/${id}`);
  } catch (error) {
    console.error(`Error fetching game ${id}:`, error);
    return null;
  }
};

export const getTeamById = async (id) => {
  try {
    return await callBackendAPI(`/teams/${id}`);
  } catch (error) {
    console.error(`Error fetching team ${id}:`, error);
    return null;
  }
};