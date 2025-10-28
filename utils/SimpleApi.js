// Simple backend API integration
const BASE_URL = "https://project2-438-backend-c8e29941b290.herokuapp.com";

// Basic API call function
export const callAPI = async (endpoint, token = null) => {
  try {
    const headers = { "Content-Type": "application/json" };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${BASE_URL}${endpoint}`, { headers });
    return response.ok ? await response.json() : null;
  } catch (error) {
    console.error("API Error:", error);
    return null;
  }
};

// Public endpoints (no auth needed)
export const getTeams = () => callAPI("/teams");
export const getGames = () => callAPI("/games");

// Authenticated endpoints (need token)
export const getAuthTeams = (token) => callAPI("/api/teams", token);
export const getAuthGames = (token) => callAPI("/api/games", token);
export const getFavorites = (token) => callAPI("/api/favorites", token);

// Simple database operations (using public endpoints for now)
export const addGame = async (gameData) => {
  try {
    const response = await fetch(`${BASE_URL}/games`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(gameData)
    });
    return response.ok ? await response.json() : null;
  } catch (error) {
    console.error("Add game error:", error);
    return null;
  }
};

export const deleteGame = async (gameId) => {
  try {
    const response = await fetch(`${BASE_URL}/games/${gameId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    });
    return response.ok;
  } catch (error) {
    console.error("Delete game error:", error);
    return false;
  }
};

export const addTeam = async (teamData) => {
  try {
    const response = await fetch(`${BASE_URL}/teams`, {
      method: "POST", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(teamData)
    });
    return response.ok ? await response.json() : null;
  } catch (error) {
    console.error("Add team error:", error);
    return null;
  }
};